import { NextResponse } from 'next/server';

const GITHUB_USERNAME = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'aliqaiser';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const headers: HeadersInit = {
  'Accept': 'application/vnd.github+json',
  ...(GITHUB_TOKEN ? { Authorization: `Bearer ${GITHUB_TOKEN}` } : {}),
};

// GraphQL for pinned repos + contribution data
const PINNED_QUERY = `
  query {
    user(login: "${GITHUB_USERNAME}") {
      pinnedItems(first: 6, types: REPOSITORY) {
        nodes {
          ... on Repository {
            name
            description
            url
            stargazerCount
            forkCount
            primaryLanguage { name color }
            languages(first: 5) {
              edges { size node { name color } }
            }
          }
        }
      }
      contributionsCollection {
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
              color
            }
          }
        }
      }
      followers { totalCount }
      repositories(first: 100, isFork: false) {
        nodes { primaryLanguage { name color } }
      }
    }
  }
`;

export async function GET() {
  try {
    // GraphQL data (pinned repos + contributions + stats)
    const graphqlRes = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: PINNED_QUERY }),
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    const graphqlData = await graphqlRes.json();
    const userData = graphqlData?.data?.user;

    // Aggregate language distribution
    const languageMap: Record<string, number> = {};
    userData?.repositories?.nodes?.forEach((repo: any) => {
      const lang = repo?.primaryLanguage?.name;
      if (lang) languageMap[lang] = (languageMap[lang] || 0) + 1;
    });
    const languages = Object.entries(languageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }));

    // Latest events (commits, etc.)
    const eventsRes = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=10`,
      { headers, next: { revalidate: 1800 } }
    );
    const events = eventsRes.ok ? await eventsRes.json() : [];
    const latestCommits = events
      .filter((e: any) => e.type === 'PushEvent')
      .slice(0, 5)
      .map((e: any) => ({
        repo: e.repo.name.replace(`${GITHUB_USERNAME}/`, ''),
        message: e.payload.commits?.[0]?.message || 'No message',
        date: e.created_at,
        url: `https://github.com/${e.repo.name}`,
      }));

    return NextResponse.json({
      pinnedRepos: userData?.pinnedItems?.nodes || [],
      contributionCalendar: userData?.contributionsCollection?.contributionCalendar,
      totalContributions: userData?.contributionsCollection?.contributionCalendar?.totalContributions || 0,
      totalCommits: userData?.contributionsCollection?.totalCommitContributions || 0,
      followers: userData?.followers?.totalCount || 0,
      languages,
      latestCommits,
    });
  } catch (error) {
    console.error('GitHub API error:', error);
    return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
