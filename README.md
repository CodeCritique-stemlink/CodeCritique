# CodeCritic

A peer code-review platform where developers submit their projects for review, give and receive structured feedback from other developers, and earn Karma points for contributing.

## About

CodeCritic lets developers submit a project (a title, description, and GitHub link) for peer review. Reviewers score submissions against a set of custom criteria, leave notes on strengths and areas for improvement, and share helpful resources. Users build up Karma points for participating, and can follow tags for the kinds of projects they're interested in reviewing.

## Features

* Submit projects for review with a title, description, GitHub URL, and tags
* Leave structured reviews: strengths, improvements, resources, and per-criteria ratings
* Custom review criteria per submission
* Karma point system to reward active reviewers
* Tag-based interests so users can find projects relevant to them
* Authentication and user profiles via Clerk

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS, Shadcn/UI, Zustand |
| Auth | Clerk |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL |

## Project Structure

```text
CodeCritique/
├── backend/
│   ├── prisma/              # Prisma schema and migrations
│   └── src/
│       ├── controller/      # Route handlers
│       ├── service/         # Business logic
│       ├── repository/      # Prisma data-access layer
│       ├── models/          # Zod validation schemas
│       ├── middleware/      # Auth (Clerk) and request validation
│       ├── routes/          # Express routers
│       └── app.ts           # App entry point
└── frontend/
    └── codecritique/
        ├── app/              # Next.js app router pages (dashboard, submit, profile, etc.)
        ├── components/ui/    # Shadcn/UI components
        └── lib/              # Shared frontend utilities
```

## Pre-requisites

* Node.js 20+
* npm 10+
* PostgreSQL database
* A [Clerk](https://clerk.com) account (for auth keys)

## Getting Started

### Backend

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

The API runs on `http://localhost:4000` by default.

### Frontend

```bash
cd frontend/codecritique
npm install
npm run dev
```

The app runs on `http://localhost:3000` by default.

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Required |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `PORT` | Server port | No (default `4000`) |

### Frontend (`frontend/codecritique/.env.local`)

Set your Clerk publishable/secret keys and the backend API URL as required by `@clerk/nextjs`.

## API Overview

All routes are mounted under `/api`. Endpoints marked 🔒 require authentication (Clerk session).

| Resource | Endpoints |
|---|---|
| **Users** | `GET /users/profile` 🔒 · `GET /users/profile/:UserName` 🔒 · `PUT /users/profile` 🔒 · `DELETE /users/profile` 🔒 |
| **Submissions** | `GET /submissions` · `GET /submissions/:id` · `POST /submissions` 🔒 · `PUT /submissions/:id` 🔒 · `DELETE /submissions/:id` 🔒 |
| **Reviews** | `GET /reviews/submission/:submissionId` · `GET /reviews/reviewer/:reviewerId` · `GET /reviews/:id` · `POST /reviews/:submissionId` 🔒 · `DELETE /reviews/:id` 🔒 |
| **Review Criteria** | `GET /criterias/:id` 🔒 · `GET /criterias/submission/:submissionId` 🔒 · `POST /criterias` 🔒 · `PUT /criterias/:id` 🔒 · `DELETE /criterias/:id` 🔒 |
| **Ratings** | `GET /ratings/:id` 🔒 · `GET /ratings/review/:reviewId` 🔒 · `PUT /ratings/:id` 🔒 · `DELETE /ratings/:id` 🔒 |
| **Tags** | `GET /tags` · `GET /tags/:id` 🔒 · `POST /tags` 🔒 · `PUT /tags/:id` 🔒 · `DELETE /tags/:id` 🔒 |

Request bodies and query params are validated with Zod (see `backend/src/models`).

## Data Model

Core entities, defined in `backend/prisma/schema.prisma`:

* **User** - has Karma points, submissions, reviews, and followed tags
* **Submission** - a project posted for review (title, description, GitHub URL, status, tags)
* **Review** - feedback on a submission (strengths, improvements, resources, ratings)
* **ReviewCriteria** - custom, per-submission criteria that reviews are scored against
* **Rating** - a score tied to a specific review and criteria
* **Tag** - shared between submissions and users' interests
