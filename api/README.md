# Portfolio API

![CI](https://github.com/<YOUR_GITHUB_USERNAME>/<YOUR_REPOSITORY>/actions/workflows/ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-21-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen)

API Spring Boot orientee portfolio pour montrer:
- architecture REST (controller/service/repository)
- securite JWT et roles
- validation des entrees + gestion d'erreurs globale
- tests unitaires et d'integration
- pipeline CI GitHub Actions

## Stack
- Java 21
- Spring Boot 3.3
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- JUnit 5 / Mockito / MockMvc

## Swagger / OpenAPI
- UI: `http://localhost:3000/swagger-ui/index.html`
- Spec JSON: `http://localhost:3000/v3/api-docs`
- Spec YAML statique projet: `documentation.yaml`

## Endpoints principaux
- `POST /auth/register`
- `POST /auth/login`
- `POST /service` (role `SERVICE_PROVIDER`)
- `GET /service/{id}`
- `GET /service/validated/all`
- `GET /service/my-services` (role `SERVICE_PROVIDER`)
- `POST /reservation`
- `PATCH /reservation/{id}/cancel`
