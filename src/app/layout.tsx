import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/effects/CustomCursor';
import { CommandPalette } from '@/components/effects/CommandPalette';
import { LoadingScreen } from '@/components/effects/LoadingScreen';
import { ScrollProgress } from '@/components/effects/ScrollProgress';
import { EasterEgg } from '@/components/effects/EasterEgg';
import { ScreenshotProvider } from '@/components/effects/ScreenshotContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://aliqaiser.dev'),
  title: {
    default: 'Muhammad Ali Qaiser | AI Engineer',
    template: '%s | Ali Qaiser',
  },
  description: 'AI Engineer specializing in Computer Vision, LLM Engineering, and Information Retrieval.',
  keywords: ['AI Engineer', 'Computer Vision', 'LLM', 'Machine Learning', 'Portfolio', 'Pakistan'],
  authors: [{ name: 'Muhammad Ali Qaiser' }],
  creator: 'Muhammad Ali Qaiser',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://aliqaiser.dev',
    siteName: 'Ali Qaiser Portfolio',
    title: 'Muhammad Ali Qaiser | AI Engineer',
    description: 'AI Engineer specializing in Computer Vision, LLM Engineering, and Information Retrieval.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Ali Qaiser | AI Engineer',
    description: 'AI Engineer specializing in Computer Vision, LLM Engineering, and Information Retrieval.',
    creator: '@aliqaiser',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`}>
      <body className={`${inter.className} bg-black text-white antialiased cursor-none`}>
        <ScreenshotProvider>
          <LoadingScreen />
          <ScrollProgress />
          <EasterEgg />
          <CustomCursor />
          <CommandPalette />
          {children}
        </ScreenshotProvider>
      </body>
    </html>
  );
}
