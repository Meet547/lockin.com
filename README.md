# 🔒 Lockin — Premium Focus & Productivity App

**Lockin** is a modern, high-fidelity focus and productivity application designed to help users block distractions, track their focus statistics, and stay in the zone. Built with Next.js, Tailwind CSS, Framer Motion, and Prisma.

---

## ✨ Key Features

- **🎯 Interactive Focus Sessions**: Choose from three customizable difficulty modes:
  - **Easy Mode**: Soft reminders when you visit distracting sites.
  - **Hard Mode**: Stricter blocks, prompting you to stay on track.
  - **Monk Mode**: Ultimate lock-in. No bypasses allowed.
- **📊 Real-time Productivity Dashboard**: Tracks total focus time, block rate percentage, and historical insights with interactive charts.
- **🛡️ Custom Site Blocklist**: Manage your personal list of blocked domains directly through the settings interface.
- **🧩 Browser Extension Mockup**: An intuitive Chrome Extension UI preview that syncs seamlessly with your main dashboard.
- **✨ Apple-Style Premium Design**: Dark mode default, smooth blur transitions, micro-animations, and a layout that is visually stunning.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Shadcn UI](https://ui.shadcn.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Database**: [Prisma ORM](https://www.prisma.io/) with [SQLite](https://www.sqlite.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)

---

## 🚀 Getting Started (Local Development)

To run this project locally, follow these steps:

### 1. Clone the repository and install dependencies

```bash
# Clone the repository
git clone <your-repository-url>
cd lockin

# Install dependencies
bun install
# or
npm install
```

### 2. Set up environment variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-super-secret-random-key"
```

### 3. Initialize the database

Generate Prisma Client and push the schema to your local SQLite database:

```bash
npx prisma db push
```

### 4. Run the development server

```bash
bun dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🌐 Deployment & Hosting

### Option A: Serverless Hosting (e.g., Vercel)
Next.js apps deploy natively to Vercel. However, since Vercel's serverless functions are read-only and ephemeral, you cannot write to a local SQLite database file there.

To host the full version on Vercel:
1. Provision a serverless SQL database (like **Neon** for PostgreSQL, **Supabase**, or **Turso** for serverless SQLite/libsql).
2. Update the `datasource db` provider in `prisma/schema.prisma` to match your database type.
3. Update the `DATABASE_URL` environment variable in your Vercel project settings.
4. Run `npx prisma db push` against the production database.

### Option B: Persistent Container Hosting (e.g., Railway, Render, Fly.io)
If you want to use SQLite out-of-the-box without changing the database provider:
1. Deploy the project to **Railway**, **Render**, or **Fly.io** using their Node.js / Docker runner.
2. Mount a **Persistent Volume** to store the database file (e.g., at `/app/db/dev.db`).
3. Set the environment variable `DATABASE_URL="file:/app/db/dev.db"` to make sure the database is saved persistently across deployments.
