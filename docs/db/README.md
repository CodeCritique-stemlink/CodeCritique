# Database Design

See `er-diagram.png` for the full entity-relationship diagram.

## Entities

- **User** — an authenticated developer (via Clerk), with Karma points and a tech stack (interested tags)
- **Submission** — a project posted for review (title, description, GitHub URL, status, tags)
- **Review** — feedback left on a submission (strengths, improvements, resources, ratings)
- **ReviewCriteria** — 1–5 custom criteria defined per submission, which reviewers score against
- **Rating** — a numeric score (1–10) tied to one review and one criterion
- **Tag** — a technology/skill, shared between submissions and users' tech stacks

## Key design decisions

- **Tags are many-to-many on both User and Submission.** A user's tech stack (interested tags) is matched against a submission's tags to power the personalized feed — submissions sharing more tags with the logged-in user's tech stack rank higher.
- **Ratings are stored per-criterion, not as a single score per review.** Since each submission defines its own custom criteria, reviewers score each one individually rather than giving one overall number.
- **Karma is a plain integer on User**, incremented by a fixed +2 per review submitted — matches the spec's requirement that Karma is static, not dynamically weighted.
- **Submission status** (`PENDING` / `REVIEWED`) is derived from whether any reviews exist, not manually set by users.