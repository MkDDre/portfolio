# Fullstack Portfolio (Demo Project)

This repository contains a deliberately simple fullstack project.

Main goal:
- show how I build an application end to end;
- demonstrate solid fundamentals in architecture, API, frontend, testing, and CI;
- prove my ability to deliver a clean and maintainable technical foundation.

This project is not meant to showcase advanced product complexity or high-end visual design.
Its purpose is to show that I can write clean code, structure a project properly, and deliver a complete stack.

For more product-oriented work focused on UX and polish, my other websites currently in production complete this showcase.

## What this project demonstrates

- Design of a secure REST API with roles and JWT.
- Setup of a TypeScript SPA frontend.
- Client-side state management (auth, session, cart).
- Frontend/backend integration through a reverse proxy.
- Unit and integration testing practices.
- CI pipeline with automated test execution.

## Tech stack

- Frontend: React, TypeScript, Vite, Tailwind
- Backend: Java 21, Spring Boot, Spring Security, JPA
- Database: PostgreSQL
- Local infrastructure: Docker Compose + Nginx
- Quality tooling: ESLint, Vitest, JUnit/MockMvc, GitHub Actions

## Repository architecture

- frontend: web application (pages, contexts, frontend tests)
- api: Spring Boot API (controllers, services, repositories, backend tests)
- docker-compose.yml: local orchestration for the full stack
- nginx.conf: reverse proxy between frontend and API

## Covered features

- Authentication: register, login, session handling
- Services: public listing, create/moderate based on user role
- Reservations: create, cancel, and list user reservations
- Dedicated portals: provider area and admin area

## Why a deliberately basic scope

The scope is intentionally compact to highlight:
- foundation quality;
- code readability;
- essential business logic;
- ability to deliver a complete development flow.

The point is to evaluate technical mastery, not to stack features just to make the project look bigger.

## Quick local start

Prerequisites:
- Docker + Docker Compose

From the project root:

```bash
docker compose up -d --build
```

Access points:
- App through reverse proxy: http://localhost
- Frontend direct: http://localhost:5172
- API direct: http://localhost:3000
- Local PostgreSQL: localhost:5446

Stop:

```bash
docker compose down
```

## Tests and quality

Frontend:

```bash
cd frontend
npm run test -- --run
npx eslint .
```

Backend:

```bash
cd api
./mvnw test
```

CI:
- GitHub Actions workflow available in .github/workflows/github-ci.yml

## Conclusion

This project has a clear purpose: demonstrate practical, professional fullstack skills.

It showcases my ability to:
- analyze requirements;
- structure architecture;
- implement frontend and backend;
- test and maintain quality;
- industrialize delivery with a CI pipeline.