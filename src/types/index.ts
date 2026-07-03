import { z } from 'zod';
import * as schemas from '@/lib/validations/schemas';

export type Profile = z.infer<typeof schemas.ProfileSchema>;
export type Project = z.infer<typeof schemas.ProjectSchema>;
export type Skill = z.infer<typeof schemas.SkillSchema>;
export type Blog = z.infer<typeof schemas.BlogSchema>;
export type Research = z.infer<typeof schemas.ResearchSchema>;
export type Education = z.infer<typeof schemas.EducationSchema>;
export type Experience = z.infer<typeof schemas.ExperienceSchema>;
export type Certificate = z.infer<typeof schemas.CertificateSchema>;
export type Resume = z.infer<typeof schemas.ResumeSchema>;
export type SocialLink = z.infer<typeof schemas.SocialLinkSchema>;
export type Message = z.infer<typeof schemas.MessageSchema>;
export type Analytics = z.infer<typeof schemas.AnalyticsSchema>;
export type Settings = z.infer<typeof schemas.SettingsSchema>;

// Extend standard User to include custom admin roles if necessary
export interface UserSession {
  uid: string;
  email: string;
  name?: string;
  picture?: string;
  isAdmin: boolean;
}
