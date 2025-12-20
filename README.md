# HelmyLMS

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Shadcn UI](https://img.shields.io/badge/Shadcn_UI-000000?style=flat&logo=shadcnui&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.0.0-2D3748?style=flat&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-336791?style=flat&logo=postgresql&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-1.3.34-blue?style=flat)
![Resend](https://img.shields.io/badge/Resend-6.4.1-black?style=flat)
![Stripe](https://img.shields.io/badge/Stripe-20.0.0-635BFF?style=flat&logo=stripe&logoColor=white)
![Tigris](https://img.shields.io/badge/Tigris-S3--Compatible-FF6B35?style=flat)
![Netlify](https://img.shields.io/badge/Netlify-00C46A?style=flat&logo=netlify&logoColor=white)

A modern, full-featured Learning Management System (LMS) built with Next.js, designed to provide an interactive and engaging online learning experience. This platform allows instructors to create and manage courses, while students can enroll, track progress, and access educational content seamlessly.

## Table of Contents

- [Live Demo](#live-demo)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [API Routes](#api-routes)
- [Deployment](#deployment)

## Live Demo

🚀 [View Live Demo](https://helmylms.netlify.app)

## Features

- 🔐 **Secure Authentication** — Better Auth with GitHub OAuth and email verification (Resend).
- 📚 **Course Management** — Create/edit courses, chapters, lessons with drag-and-drop reordering (@dnd-kit).
- 💳 **Payments & Enrollment** — Stripe integration for paid courses and seamless enrollment.
- ⚙️ **Admin Panel** — Full control over courses, enrollments, and analytics (Recharts).
- 📊 **Progress Tracking** — Student lesson completion and detailed progress.
- 📁 **File Uploads** — Secure uploads to Tigris (S3-compatible) for images, thumbnails, and videos.
- ✍️ **Rich Text Editor**: Integrated TipTap editor for creating courses/lessons description.
- 📱 **Responsive & Modern UI** — Tailwind CSS + shadcn/ui + Lucide Icons + Dark/Light Mode.
- 🛡️ **Security** — Arcjet for bot protection, rate limiting, and more.
- 📧 **Email Notifications**: Email verification and notifications using Resend.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui, Lucide Icons
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: Better Auth
- **Payments**: Stripe
- **File Storage**: Tigris Object Storage (S3-compatible)
- **Email**: Resend
- **Security**: Arcjet
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Drag & Drop**: @dnd-kit
- **Editor**: Tiptap
- **File Uploads**: React-dropzone

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Tigris bucket (S3-compatible)
- GitHub OAuth app
- Stripe account
- Resend account

## Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd HelmyLMS
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following variables:

   ```env
   BETTER_AUTH_SECRET=your-better-auth-secret
   BETTER_AUTH_URL=http://localhost:3000
   DATABASE_URL=your-postgresql-connection-string
   AUTH_GITHUB_CLIENT_ID=your-github-client-id
   AUTH_GITHUB_CLIENT_SECRET=your-github-client-secret
   RESEND_API_KEY=your-resend-api-key
   ARCJET_KEY=your-arcjet-key
   AWS_ACCESS_KEY_ID=your-tigris-access-key-id
   AWS_SECRET_ACCESS_KEY=your-tigris-secret-access-key
   AWS_ENDPOINT_URL_S3=your-tigris-s3-endpoint-url
   AWS_ENDPOINT_URL_IAM=your-tigris-iam-endpoint-url
   AWS_REGION=your-tigris-region
   NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES=your-tigris-bucket-name
   STRIPE_SECRET_KEY=your-stripe-secret-key
   STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   ```

4. **Set up the database:**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server:**

   ```bash
   pnpm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
HelmyLMS/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (public)/          # Public pages
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   ├── dashboard/         # User dashboard
│   ├── data/              # Data access layer functions
│   └── ...
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility libraries and configurations
├── prisma/                # Database schema and migrations
└── public/                # Static assets
```

## Database Schema

The application uses Prisma with PostgreSQL. Key models include:

- **User**: User accounts with roles (admin/user)
- **Course**: Course information with pricing and metadata
- **Chapter**: Course chapters for organization
- **Lesson**: Individual lessons with video content
- **Enrollment**: User course enrollments
- **LessonProgress**: Tracking of lesson completion

## API Routes

- `/api/auth/[...all]` - Authentication endpoints
- `/api/s3/upload` - File upload to S3
- `/api/s3/delete` - File deletion from S3
- `/api/webhook/stripe` - Stripe webhook handling

## Deployment

### Deploy to Netlify

1. **Connect your repository to Netlify:**

   - Go to [Netlify](https://netlify.com) and connect your GitHub repository
   - Select the repository and authorize Netlify

2. **Configure build settings:**

   - Build command: `pnpm build`
   - Publish directory: `.next`
   - Functions directory: `api`

3. **Set environment variables:**

   - Add all the environment variables from your `.env` file to Netlify's environment variables section

4. **Deploy:**
   - Netlify will automatically deploy on every push to your main branch

**Alternative Deployment Options:**

- 🐳 Docker + any cloud provider (AWS, GCP, Azure, etc.)
- 💻 Self-hosted VPS
