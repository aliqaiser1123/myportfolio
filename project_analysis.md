# Project Analysis Report: AI Engineer Portfolio

## Overview
This project is a modern, full-stack personal portfolio and blog application built for an AI Engineer (Ali Qaiser). It features a public-facing showcase and a secured admin dashboard for content management. 

## Technology Stack
- **Framework**: [Next.js 14/15](https://nextjs.org/) using the App Router for server-rendered and static pages.
- **UI & Styling**: 
  - **Tailwind CSS v4** for utility-first styling.
  - **Shadcn UI** components (built on Radix and Lucide icons) for a sleek, accessible design.
  - **Framer Motion** for micro-animations and page transitions.
- **Backend & Database**: 
  - **Firebase** (Client and Admin SDKs) providing Authentication, Firestore (NoSQL Database), and Storage.
- **Form Handling & Validation**: **React Hook Form** paired with **Zod** schema validation.
- **Content Management**: **Tiptap** for rich-text editing in the admin panel.

## Architecture & Folder Structure

### `src/app/` (Routing)
The application leverages Next.js App Router conventions:
- **Public Routes**: Pages like `/`, `/blog`, and `/projects` display content to visitors.
- **Admin Routes (`/admin`)**: A protected route group `(protected)` handles the CMS functionalities (Dashboard, Projects, Skills, Blog, Messages, etc.). These routes verify Firebase session cookies on the server before granting access.

### `src/components/` (UI Components)
The UI is modularized into several domains:
- **`admin/`**: Components specific to the admin dashboard (e.g., Sidebar, Forms, LogoutButton).
- **`home/`**: Sections for the landing page (e.g., Hero, Resume preview).
- **`layout/`**: Shared layout wrappers like Headers, Footers, and Admin layout wrappers.
- **`ui/`**: Reusable low-level Shadcn components (Buttons, Inputs, Cards).
- **`effects/`**: Interactive graphical components, including easter eggs and visual flair.

### `src/firebase/`
Contains the configuration and initialization logic for both the client (`config.ts`) and the secure server environment (`admin.ts`). This division ensures that sensitive Firebase Admin credentials are only used in server contexts (like API routes or layout validations).

### `src/lib/`
Houses utility functions and schema validations.
- **`validations/schemas.ts`**: Defines Zod schemas for all Firestore data models. This ensures data consistency across forms and database reads/writes.

### `src/hooks/`
Contains custom React hooks, such as `useFirestore`, which abstract away the complexity of Firebase database operations (fetching, adding, deleting) and provide loading states directly to the components.

## Data Models (Collections)
The application relies on several Firestore collections defined by Zod schemas:
1. **Profile & Settings**: Basic metadata, site configuration, and SEO details.
2. **Projects**: Contains fields like `techStack`, `githubUrl`, `liveUrl`, and `featured` flags.
3. **Blog**: Supports structured JSON from the Tiptap rich-text editor, publication status, and slugs.
4. **Skills & Resume**: Structured data for categories, proficiency levels, and education/experience timelines.
5. **Research & Certificates**: Detailed attributes for academic and professional milestones.
6. **Messages**: Stores contact form submissions.
7. **Analytics**: Tracks page views and unique visitors.

## Authentication Flow
The admin area is protected via Firebase Authentication using Google Sign-In. 
- The client obtains an ID token and a server action/API route likely sets a `session` cookie.
- The `admin/(protected)/layout.tsx` file reads this cookie using Next.js `cookies()` and verifies it with the Firebase Admin SDK (`adminAuth.verifySessionCookie`).
- It includes hardcoded email whitelisting (`aliqaiser1123@gmail.com`) to restrict access strictly to the owner.

## Key Features & Highlights
- **Server-Side Security**: By verifying session cookies in the server-side layout, unauthorized users never even download the JavaScript bundle for the admin panel.
- **Rich Text Blog**: The integration of Tiptap allows for complex blog post creation with code blocks, links, and images directly from the custom admin panel.
- **Optimized UI**: Usage of `lucide-react` and `framer-motion` implies a highly polished, interactive user interface aligned with modern design aesthetics.
