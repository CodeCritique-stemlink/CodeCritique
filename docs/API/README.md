# CodeCritic – API Design Document

## 1. Introduction

The CodeCritic API is a RESTful backend service developed for the CodeCritic peer code review platform. It provides APIs for user profiles, code submissions, technology tags, review criteria, reviews, and ratings.

The CodeCritic is implemented using **Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL**. **Clerk** is used for authentication, while **Zod** is used for request validation.

## 2. API Endpoints

| Resource        | Method | Endpoint                                    | Authentication |
| --------------- | ------ | ------------------------------------------- | -------------- |
| User            | GET    | `/users/profile`                            | Required       |
| User            | GET    | `/users/profile/:username`                  | Required       |
| User            | PUT    | `/users/profile`                            | Required       |
| User            | DELETE | `/users/profile`                            | Required       |
| Tag             | GET    | `/tags`                                     | Public         |
| Tag             | GET    | `/tags/:id`                                 | Required       |
| Tag             | POST   | `/tags`                                     | Required       |
| Tag             | PUT    | `/tags/:id`                                 | Required       |
| Tag             | DELETE | `/tags/:id`                                 | Required       |
| Submission      | GET    | `/submissions`                              | Public         |
| Submission      | GET    | `/submissions/:id`                          | Public         |
| Submission      | POST   | `/submissions`                              | Required       |
| Submission      | PUT    | `/submissions/:id`                          | Required       |
| Submission      | DELETE | `/submissions/:id`                          | Required       |
| Review Criteria | GET    | `/criterias/:id`                            | Public         |
| Review Criteria | GET    | `/criterias/submission/:submissionId`       | Public         |
| Review Criteria | POST   | `/criterias`                                | Required       |
| Review Criteria | PUT    | `/criterias/:id`                            | Required       |
| Review Criteria | DELETE | `/criterias/:id`                            | Required       |
| Review          | GET    | `/reviews/:id`                              | Public         |
| Review          | GET    | `/reviews/submission/:submissionId`         | Public         |
| Review          | GET    | `/reviews/reviewer/:reviewerId`             | Public         |
| Review          | POST   | `/reviews/:submissionId`                    | Required       |
| Review          | DELETE | `/reviews/:id`                              | Required       |
| Rating          | GET    | `/ratings/:id`                              | Required       |
| Rating          | GET    | `/ratings/review/:reviewId`                 | Required       |
| Rating          | PUT    | `/ratings/:id`                              | Required       |
| Rating          | DELETE | `/ratings/:id`                              | Required       |

## 3. Authentication and Authorization

Authentication is handled using **Clerk**. Protected endpoints use the `requireAuth` Auth middleware to verify the authenticated user.

Authorization checks are applied when users modify or delete resources to ensure that users can only access resources they are permitted to manage.

## 4. Request Validation

Request data is validated using **Zod schemas** through the validation middleware. Validation is applied to relevant request bodies, query parameters, and route parameters before requests reach the controllers.

## 5. Standard HTTP status codes

Standard HTTP status codes are used, including:

* **200** – Successful request
* **201** – Resource created
* **400** – Invalid request
* **401** – Authentication required
* **403** – Access denied
* **404** – Resource not found
* **500** – Internal server error

## 6. Architecture

This follows a layered architecture:

**Client -> Router -> Middleware -> Controller -> Service -> Repository -> Prisma -> PostgreSQL**

This structure separates routing, authentication, validation, business logic, and database operations, improving maintainability and scalability.

## 7. API Scope

The current API supports the core CodeCritic functionality:

* User profile management
* Code submission management
* Technology tag management
* Review criteria management
* Peer review management
* Review ratings
* Authentication and validation

