import * as z from 'zod';

export const ProfileSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  headline: z.string().min(1, 'Headline is required'),
  bio: z.string().min(1, 'Bio is required'),
  avatarUrl: z.string().url('Must be a valid URL').optional(),
  location: z.string().optional(),
});

export const ProjectSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  imageUrl: z.string().url('Must be a valid URL'),
  techStack: z.array(z.string()).min(1, 'At least one technology is required'),
  githubUrl: z.string().url('Must be a valid URL').optional(),
  liveUrl: z.string().url('Must be a valid URL').optional(),
  featured: z.boolean().default(false),
  order: z.number().default(0),
});

export const SkillSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  icon: z.string().min(1, 'Icon identifier or URL is required'),
  category: z.string().min(1, 'Category is required'),
  proficiency: z.number().min(0).max(100),
  order: z.number().default(0),
});

export const BlogSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  content: z.any(), // Storing structured JSON from rich text editor
  coverImage: z.string().url('Must be a valid URL').optional(),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  seoMetadata: z.any().optional(), // Store title, description, keywords
  readingTime: z.number().default(0),
  views: z.number().default(0),
  publishedAt: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const ResearchSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required'),
  authors: z.array(z.string()),
  conferenceOrJournal: z.string().min(1, 'Conference/Journal name required'),
  publicationDate: z.date(),
  paperUrl: z.string().url('Must be a valid URL').optional(),
  abstract: z.string().optional(),
});

export const EducationSchema = z.object({
  id: z.string().optional(),
  degree: z.string().min(1, 'Degree is required'),
  institution: z.string().min(1, 'Institution is required'),
  startDate: z.date(),
  endDate: z.date().optional(), // Optional if currently studying
  description: z.string().optional(),
});

export const ExperienceSchema = z.object({
  id: z.string().optional(),
  role: z.string().min(1, 'Role is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.date(),
  endDate: z.date().optional(), // Optional if currently working
  description: z.string().optional(),
  current: z.boolean().default(false),
});

export const CertificateSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.date(),
  url: z.string().url('Must be a valid URL').optional(),
});

export const ResumeSchema = z.object({
  pdfUrl: z.string().url('Must be a valid URL'),
  lastUpdated: z.date(),
});

export const SocialLinkSchema = z.object({
  id: z.string().optional(),
  platform: z.string().min(1, 'Platform name is required'),
  url: z.string().url('Must be a valid URL'),
  icon: z.string().optional(),
  order: z.number().default(0),
});

export const MessageSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email('Must be a valid email').optional().or(z.literal('')),
  whatsapp: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().optional(),
  createdAt: z.date().optional(),
  read: z.boolean().default(false),
});

export const AnalyticsSchema = z.object({
  id: z.string().optional(),
  pageViews: z.number().default(0),
  uniqueVisitors: z.number().default(0),
  lastUpdated: z.date(),
});

export const SettingsSchema = z.object({
  siteName: z.string().default('AI Engineer Portfolio'),
  siteDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  maintenanceMode: z.boolean().default(false),
  cyberMode: z.boolean().default(false),
  matrixRainDensity: z.number().min(1).max(100).default(50),
  cursorTrailStyle: z.enum(['none', 'glow', 'particles']).default('glow'),
  neuralNetworkIntensity: z.number().min(1).max(100).default(60),
});
