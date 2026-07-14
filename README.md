<div align="center">

# Lockin

### The Operating System for Deep Work.

*"Focus is your unfair advantage"*

<p>
  <img src="https://img.shields.io/badge/Next.js-15-black">
  <img src="https://img.shields.io/badge/TypeScript-5-blue">
  <img src="https://img.shields.io/badge/TailwindCSS-4-38BDF8">
  <img src="https://img.shields.io/badge/Chrome%20Extension-Live-green">
  <img src="https://img.shields.io/badge/Status-Active-success">
  <img src="https://img.shields.io/badge/License-MIT-yellow">
</p>

---

### Modern productivity platform built to eliminate distractions, measure focus, and help users achieve deep work.

Designed with an Apple-inspired interface, Lockin combines a web application, browser extension, analytics dashboard, and productivity tools into one ecosystem.
https://lockindotcom.vercel.app/

</div>

---

# Why Lockin?

Every year, millions of hours are lost to endless scrolling.

Traditional website blockers simply block websites.

**Lockin helps users build discipline.**

Instead of relying on willpower, Lockin creates an environment where deep work becomes the default.

Whether you're a student, developer, founder, designer, or researcher, Lockin helps you stay focused on what actually matters.

---

# Features

## Focus Mode

- Block distracting websites
- Custom focus sessions
- Smart timer
- Session countdown
- Automatic website restoration

---

## Website Blocker

- Block YouTube
- Instagram
- Twitter/X
- Reddit
- Facebook
- Netflix
- Discord

or create your own custom blacklist.

---

## Productivity Analytics

- Daily focus hours
- Weekly productivity trends
- Session history
- Most blocked websites
- Deep work statistics
- Focus streaks

---

## Minimal Dashboard

Apple-inspired interface with

- Glassmorphism
- Smooth animations
- Dark Mode
- Responsive layout
- Beautiful typography
- Zero distractions

---

## Chrome Extension

The browser extension communicates directly with the web application.

Features include

- One-click focus mode
- Website blocking
- Live countdown
- Session synchronization
- Automatic enable/disable

---

## Session Management

Create personalized sessions such as

- Study
- Coding
- Reading
- Writing
- Workout
- Custom

Each session stores

- Duration
- Block list
- Goal
- Completion status

---

## Cross Platform

Supports

- Chrome
- Edge
- Brave
- Arc

with desktop-first responsive design.

---

# Architecture

```
                    Lockin Ecosystem

               ┌─────────────────────┐
               │     Web Dashboard   │
               └──────────┬──────────┘
                          │
                          │
                 API Communication
                          │
        ┌─────────────────┴──────────────────┐
        │                                    │
        ▼                                    ▼

Chrome Extension                  Analytics Engine

        │                                    │
        │                                    │

Website Blocking                 Session Tracking

        │                                    │

        └───────────────┬────────────────────┘
                        │

                 User Productivity
```

---

# Tech Stack

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- Framer Motion

---

## Backend

- Node.js
- API Routes
- Server Actions

---

## Database

- Supabase

---

## Authentication

- Clerk
- Supabase Auth

---

## Browser Extension

- Manifest V3
- Chrome APIs
- Storage API
- Tabs API

---

# Folder Structure

```
lockin/

├── app/
│
├── components/
│
├── hooks/
│
├── lib/
│
├── public/
│
├── styles/
│
├── extension/
│   ├── background.js
│   ├── content.js
│   ├── popup/
│   ├── manifest.json
│   └── storage.js
│
├── analytics/
│
├── utils/
│
├── assets/
│
└── README.md
```

---

# User Flow

```
Open Lockin

        │

Create Focus Session

        │

Choose Websites

        │

Start Timer

        │

Chrome Extension Activated

        │

Distractions Blocked

        │

Session Completed

        │

Analytics Updated
```

---

# Screenshots

```
assets/

dashboard.png

focus-mode.png

analytics.png

extension-popup.png

blocked-page.png
```

*(Replace with actual screenshots.)*

---

# Installation

Clone the repository

```bash
git clone https://github.com/Meet547/lockin.git
```

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

---

# Chrome Extension Setup

Enable Developer Mode

```
Chrome

↓

Extensions

↓

Developer Mode

↓

Load Unpacked

↓

Select

extension/
```

Done.

---

# Roadmap

## Completed

- Website Blocking
- Focus Timer
- Chrome Extension
- Dashboard
- Responsive UI
- Analytics
- Session History

---

## Coming Soon

- AI Productivity Coach
- Pomodoro Assistant
- Cross-device Sync
- Mobile App
- Firefox Extension
- Safari Extension
- Desktop App
- Habit Tracking
- Calendar Integration
- Weekly Reports
- Team Workspaces
- AI Focus Insights

---

# Performance Goals

- <100ms dashboard interactions
- Instant extension activation
- Lightweight browser footprint
- Responsive across all screen sizes
- Minimal CPU usage

---

# Vision

Lockin is more than a productivity app.

The long-term vision is to become the operating system for focused work, combining website blocking, habit building, analytics, AI coaching, and productivity insights into one seamless platform.

---

# Built With

- Next.js
- TypeScript
- TailwindCSS
- Supabase
- Chrome Extension APIs
- Vercel

---

# Contributing

Contributions are welcome.

If you'd like to improve Lockin, feel free to open an issue or submit a pull request.

---

# License

MIT License

---

<div align="center">

## Build discipline.

### Stay focused.

### Ship more.

⭐ If you found this project interesting, consider giving it a star.

</div>
