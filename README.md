# MailCraft AI — Production AI Email Writer SaaS

MailCraft AI is a production-ready, full-stack AI Email Writer SaaS built with Next.js App Router, Tailwind CSS v4, Vercel AI SDK, and Supabase. It transforms bullet points and context into tone-calibrated, executive-grade emails with live server-side streaming, one-click refinement, draft management, and strict Row-Level Security (RLS).

---

## 🚀 Key Features

- **Split-Pane Writing Studio**: Form inputs on the left and live streaming email preview with in-place editing on the right on desktop.
- **Configurable Multi-Provider AI**: Native support for **OpenAI** (default), **Google Gemini**, and **Anthropic Claude** via Vercel AI SDK with server-side streaming.
- **Tone & Length Calibration**: 8 calibrated tones (*Professional*, *Friendly*, *Formal*, *Persuasive*, *Direct*, *Urgent*, *Empathetic*, *Casual*) and 9 email formats.
- **1-Click Transformations**: Shorten, expand, rewrite, polish grammar, or switch tones on the fly with live streaming updates.
- **Drafts & Email History**: Save drafts, browse previous correspondence, filter by category, and search by keyword.
- **Enterprise-Grade Security**: Supabase PostgreSQL with cryptographic Row Level Security (RLS) policies and auth isolation. No service-role keys are ever exposed to the client.
- **Server-Side Usage Quotas**: Monthly generation limits (30 free generations/month) tracked and audited server-side.
- **Instant Demo Mode**: The entire UI and studio can be previewed seamlessly out of the box even before plugging in Supabase credentials.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router with TypeScript) |
| **Styling** | Tailwind CSS v4 + Radix UI Primitives + Lucide Icons |
| **Theming** | `next-themes` (Dark Mode & Light Mode support) |
| **AI Streaming** | Vercel AI SDK (`ai`, `@ai-sdk/openai`, `@ai-sdk/google`, `@ai-sdk/anthropic`) |
| **Authentication & Database** | Supabase (PostgreSQL, Supabase Auth, Row-Level Security) |
| **Validation & Forms** | Zod + React Hook Form |
| **Toasts** | Sonner |
| **Deployment** | Vercel Ready |

---

## 📂 Project Architecture

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx             # Login page with demo bypass
│   │   └── signup/page.tsx            # Signup with profile initialization
│   ├── (dashboard)/
│   │   ├── layout.tsx                 # Dashboard container with Navbar
│   │   ├── dashboard/page.tsx         # Overview, metrics, and recent activity
│   │   ├── write/page.tsx             # Split-pane Email Writing Studio
│   │   ├── history/page.tsx           # History & Drafts manager with search
│   │   └── settings/page.tsx          # Account settings, AI status & RLS info
│   ├── api/
│   │   ├── generate/route.ts          # Server-side streaming AI generation
│   │   ├── refine/route.ts            # Server-side streaming email refinement
│   │   ├── emails/                    # History list and draft saving
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts          # Email retrieve and delete
│   │   └── settings/route.ts          # Diagnostic status endpoint
│   ├── globals.css                    # Tailwind CSS v4 design system
│   ├── layout.tsx                     # Root layout with ThemeProvider & Toaster
│   └── page.tsx                       # High-converting SaaS landing page
├── components/
│   ├── ui/                            # Accessible UI primitives (Button, Card, Input, etc.)
│   ├── workspace/                     # Split-screen studio components
│   │   ├── EmailForm.tsx              # Input form with template starters
│   │   ├── EmailPreview.tsx           # Live preview, copy, edit & export
│   │   ├── ToneSelector.tsx           # Tone selection grid
│   │   ├── EmailTypeSelector.tsx      # Email type pills
│   │   ├── LengthSelector.tsx         # Length presets (Short/Medium/Detailed)
│   │   └── KeyPointsInput.tsx         # Bullet point builder
│   └── layout/
│       ├── Navbar.tsx                 # Navigation bar with user dropdown
│       └── ThemeToggle.tsx            # Dark/light theme toggle
├── lib/
│   ├── ai/
│   │   ├── provider.ts                # Configurable AI provider abstraction
│   │   └── prompts.ts                 # Executive email prompt engineering
│   ├── supabase/
│   │   ├── client.ts                  # Supabase browser client
│   │   ├── server.ts                  # Supabase server client (cookies)
│   │   └── middleware.ts              # Session refresh & route guard
│   ├── validations/
│   │   └── email.ts                   # Zod schemas for generation & drafts
│   ├── usage.ts                       # Server-side monthly usage tracker
│   └── utils.ts                       # Helper utilities (clipboard, formatters)
├── types/
│   ├── email.ts                       # Domain types
│   └── database.types.ts              # Supabase table definitions
└── supabase/
    └── migrations/
        └── 20261018000000_init_schema.sql # PostgreSQL DDL, RLS & triggers
```

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your configuration:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# AI Provider Selection: "openai" | "google" | "anthropic"
AI_PROVIDER=openai

# OpenAI (default)
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini

# Google Gemini (optional)
# GOOGLE_GENERATIVE_AI_API_KEY=AIzaSy...
# GOOGLE_MODEL=gemini-1.5-flash

# Anthropic Claude (optional)
# ANTHROPIC_API_KEY=sk-ant-...
# ANTHROPIC_MODEL=claude-3-5-haiku-latest
```

---

## 🗄️ Database Setup (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20261018000000_init_schema.sql` and execute the script.
4. This will set up:
   - `profiles` table with auto-provisioning trigger on user signup
   - `emails` table with user ownership RLS policies
   - `usage_logs` table for server-side generation audits
   - Automated `updated_at` triggers and performance indexes

---

## 💻 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Email Studio**: [http://localhost:3000/write](http://localhost:3000/write)
- **Dashboard**: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- **History & Drafts**: [http://localhost:3000/history](http://localhost:3000/history)
- **Settings**: [http://localhost:3000/settings](http://localhost:3000/settings)

---

## 🚢 Deploying to Vercel

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.example` into Vercel Project Settings -> **Environment Variables**.
4. Deploy! Vercel will automatically build the Next.js App Router application with Edge and Node.js streaming optimizations.
