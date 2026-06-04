# Linux Operations Lab

A self-directed Linux, infrastructure, and IT Operations lab focused on practical system administration, containerized services, reverse proxy configuration, monitoring, troubleshooting, and incident simulation.

This repository documents my hands-on learning path toward IT Operations, NOC, Infrastructure Support, and Junior Platform Engineering roles.

---

## Main Project

### Mini Production Server Lab

Folder:

```text
mini-production-server/
```

A production-like infrastructure lab built with:

- Docker Compose

- NGINX Reverse Proxy

- Node.js Backend

- PostgreSQL

- Redis

- cAdvisor

- Prometheus

- Grafana

- Grafana Alerting

Key practices:

- Containerized service orchestration

- Reverse proxy routing

- Internal service isolation

- Health check validation

- PostgreSQL and Redis connectivity testing

- NGINX 502 Bad Gateway troubleshooting

- Container metrics monitoring

- Realtime Grafana dashboard

- Backend failure simulation

- Alert lifecycle: Normal → Pending → Firing → Recovered

Project README:

```text
mini-production-server/README.md
```

---

## Repository Structure

```text
linux-ops-lab/
├── mini-production-server/     # Main runnable infrastructure project
├── networking/                 # Bind address, localhost, IP, port, and HTTP basics
├── nginx/                      # NGINX reverse proxy practice
├── node/                       # Simple Node.js server practice
├── docker/                     # Docker and container networking practice
├── linux/                      # Linux command and service management practice
├── security/                   # Firewall, hardening, and security mindset practice
├── certification/              # Certification learning notes
├── notes/                      # General learning notes and recaps
└── archive/                    # Older experiments and uncategorized files
```

---

## Completed Labs

### 1. Bind Address Lab

Folder:

```text
networking/bind-address/
```

Concepts practiced:

- `127.0.0.1` only accepts connections from the local machine

- `0.0.0.0` listens on all network interfaces

- LAN IP can be used by other devices in the same network

- Firewall rules still control whether external access is allowed

---

### 2. NGINX Reverse Proxy Lab

Folder:

```text
nginx/nginx-reverse-proxy/
```

Concepts practiced:

- NGINX as a public-facing entry point

- Node.js backend as an internal service

- Port `80` exposed through NGINX

- Backend port `3000` kept internal

- HTTP request forwarding through reverse proxy

- NGINX access log and error log investigation

---

### 3. Mini Production Server Lab

Folder:

```text
mini-production-server/
```

Concepts practiced:

- Docker Compose multi-container orchestration

- NGINX reverse proxy

- Backend, database, and cache integration

- Docker networking and service discovery

- Health check script

- PostgreSQL and Redis connectivity testing

- cAdvisor container metrics

- Prometheus metrics scraping

- Grafana dashboard visualization

- Grafana alert rule creation

- Backend failure simulation and recovery

---

## Security Pattern Practiced

Public-facing services:

- NGINX

- SSH

Private/internal services:

- Backend application

- PostgreSQL

- Redis

- Internal Docker services

Main principle:

```text
Expose only what needs to be accessed externally.
Keep backend, database, cache, and monitoring dependencies internal whenever possible.
```

---

## Tools & Technologies Practiced

Infrastructure and OS:

- Linux

- systemd / systemctl

- SSH

- UFW Firewall

- NGINX

Containerization:

- Docker

- Docker Compose

- Docker Networking

Backend and Services:

- Node.js

- Express.js

- PostgreSQL

- Redis

Monitoring and Observability:

- cAdvisor

- Prometheus

- Grafana

- Grafana Alerting

- Health Checks

- Log Analysis

Troubleshooting:

- `curl`

- `docker compose ps`

- `docker compose logs`

- NGINX access logs

- NGINX error logs

- Container status inspection

---

## Learning Goals

This repository is intended to strengthen practical understanding of:

- Linux operations

- Service management

- Network exposure and port binding

- Reverse proxy architecture

- Containerized infrastructure

- Monitoring and observability

- Incident detection

- Troubleshooting workflows

- Infrastructure and security fundamentals

---

## Current Focus

The current focus is to deepen understanding of the `mini-production-server` project and continue building related labs around:

- Grafana alert notifications

- GitHub Actions CI/CD

- systemd and journalctl

- centralized logging

- infrastructure automation

- cloud deployment practice
