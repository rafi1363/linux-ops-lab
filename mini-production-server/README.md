# Mini Production Server Lab

A runnable infrastructure lab that simulates a small production-like server setup using NGINX, Node.js, PostgreSQL, Redis, and Docker Compose.

## Objective

The goal of this project is to practice IT Operations fundamentals by building and operating a small service stack with reverse proxy, backend service, database, cache, and health checks.

## Architecture

User / Browser / curl
        |
        v
NGINX reverse proxy :8080
        |
        v
Node.js backend :3000
        |
        +--> PostgreSQL :5432
        |
        +--> Redis :6379

# Components

| Component           | Purpose                              |
| ------------------- | ------------------------------------ |
| NGINX               | Public entry point and reverse proxy |
| Node.js Backend     | Application service                  |
| PostgreSQL          | Database service                     |
| Redis               | Cache service                        |
| Docker Compose      | Multi-container orchestration        |
| Health Check Script | Service verification                 |

# Why This Setup Matters

In a real infrastructure environment, backend services should not always be exposed directly to users. NGINX acts as a controlled entry point, while internal services such as backend, database, and cache stay inside the private Docker network.

This setup helps practice:

- service isolation

- reverse proxy configuration

- container networking

- backend-to-database connectivity

- backend-to-cache connectivity

- basic operational troubleshooting
  
  # How to Run

From this folder:

`docker compose up -d --build`

Check running containers:

`docker compose ps`

Run health check:

`./scripts/health-check.sh`

Or test manually:

`curl http://localhost:8080
curl http://localhost:8080/api/health
curl http://localhost:8080/api/db-test
curl http://localhost:8080/api/redis-test`

# Expected Result

The service should be accessible through NGINX on port 8080.

The backend should not be exposed directly to the host. Requests should go through NGINX first, then be forwarded to the backend container.

# Troubleshooting Commands

`docker compose ps
docker compose logs nginx
docker compose logs backend
docker compose logs postgres
docker compose logs redis`

Check NGINX behavior:

`curl -i http://localhost:8080`

Stop backend to simulate failure:

`docker compose stop backend
curl -i http://localhost:8080
docker compose logs nginx`

Start backend again:

`docker compose start backend
curl -i http://localhost:8080`

# What I Learned

- NGINX can be used as a single public entry point for backend services.

- Docker Compose helps run multiple related services in one isolated environment.

- PostgreSQL and Redis should stay internal and not be exposed directly unless needed.

- Logs are important for identifying whether a problem comes from NGINX, backend, database, or cache.

- A service can be running, but still fail if its dependency is unavailable.
