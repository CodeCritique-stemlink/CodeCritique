# CodeCritic

A peer code-review platform where developers submit projects for review, give and receive structured feedback, and earn Karma points for contributing.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, Tailwind CSS, Shadcn/UI, Zustand |
| Auth | Clerk |
| Backend | Node.js + Express |
| ORM | Prisma |
| Database | PostgreSQL |

## Project Structure
CodeCritique/
├── backend/ # Express API, Prisma schema & migrations
└── frontend/ # Next.js app

## Getting Started

### Backend
```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

### Frontend
```bash
cd frontend/codecritique
npm install
npm run dev
```