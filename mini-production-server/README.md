# Mini Production Server Lab

A production-like infrastructure lab built using Docker Compose, NGINX, Node.js, PostgreSQL, Redis, Prometheus, Grafana, and cAdvisor.

This project was created to practice core IT Operations, Infrastructure, and Platform Engineering concepts including reverse proxy configuration, container networking, service monitoring, health validation, troubleshooting, and incident simulation.

---

## Objectives

This lab focuses on learning and validating:

* Docker containerization
* Docker Compose orchestration
* Reverse proxy configuration with NGINX
* Backend-to-database communication
* Backend-to-cache communication
* Health check automation
* Service troubleshooting
* Infrastructure monitoring
* Operational incident simulation

---

## Architecture

```text
User / Browser / curl
        |
        v
NGINX Reverse Proxy :8080
        |
        v
Node.js Backend :3000
        |
        +--> PostgreSQL :5432
        |
        +--> Redis :6379

Docker Containers
        |
        v
cAdvisor
        |
        v
Prometheus :9090
        |
        v
Grafana :3001
```

---

## Components

| Component           | Purpose                              |
| ------------------- | ------------------------------------ |
| NGINX               | Reverse proxy and public entry point |
| Node.js Backend     | Application service                  |
| PostgreSQL          | Relational database                  |
| Redis               | Cache service                        |
| Docker Compose      | Multi-container orchestration        |
| cAdvisor            | Container metrics exporter           |
| Prometheus          | Metrics collection and storage       |
| Grafana             | Monitoring dashboard                 |
| Health Check Script | Service validation                   |

---

## Why This Setup Matters

In production environments, backend services should not always be exposed directly to end users.

NGINX acts as a controlled entry point while internal services remain isolated inside the Docker network.

This setup helps practice:

* Service isolation
* Reverse proxy architecture
* Container networking
* Database connectivity
* Cache connectivity
* Monitoring and observability
* Operational troubleshooting

---

## How to Run

Start all services:

```bash
docker compose up -d --build
```

Check running containers:

```bash
docker compose ps
```

Run automated health checks:

```bash
./scripts/health-check.sh
```

Manual validation:

```bash
curl http://localhost:8080
curl http://localhost:8080/api/health
curl http://localhost:8080/api/db-test
curl http://localhost:8080/api/redis-test
```

---

## Validation & Troubleshooting

### 1. Services Running

![Services Running](assets/screenshots/01-docker-compose-service-running.png)

All containers are successfully started and running through Docker Compose.

---

### 2. Health Check Validation

![Health Check](assets/screenshots/02-health-check-success.png)

The health-check script validates:

* NGINX reverse proxy
* Backend availability
* PostgreSQL connectivity
* Redis connectivity

---

### 3. NGINX Access Logs

![NGINX Logs](assets/screenshots/03-nginx-access-log.png)

Requests are successfully routed through NGINX to the backend service.

---

### 4. Backend Service Failure Simulation

![Backend Stopped](assets/screenshots/04-backend-service-stopped.png)

The backend service is intentionally stopped to simulate an operational incident.

---

### 5. HTTP 502 Bad Gateway

![502 Bad Gateway](assets/screenshots/05-nginx-502-bad-gateway.png)

With the backend unavailable, NGINX returns HTTP 502 Bad Gateway.

This behavior is expected and demonstrates dependency failure handling.

---

### 6. NGINX Error Log Investigation

![NGINX Error Logs](assets/screenshots/06-nginx-error-log-investigation.png)

The issue is investigated using service logs and HTTP response validation.

---

### 7. Service Recovery

![Backend Recovery](assets/screenshots/07-backend-restart-and-health-check.png)

The backend service is restarted and health checks confirm successful recovery.

---

## Monitoring Stack

The project includes a basic observability stack built with:

* cAdvisor
* Prometheus
* Grafana

### cAdvisor

Collects container metrics such as:

* CPU usage
* Memory usage
* Network traffic
* Container status

### Prometheus

Scrapes metrics from cAdvisor every 5 seconds and stores them as time-series data.

### Grafana

Visualizes collected metrics through dashboards for operational monitoring.

---

## Realtime Metrics Dashboard

![Grafana Dashboard](assets/screenshots/08-grafana-realtime-metrics.png)

Grafana visualizes:

* Container CPU usage
* Memory consumption
* Network traffic
* Service behavior during load testing

During continuous requests to the backend API, CPU, memory, and network metrics increased as expected, validating the monitoring stack configuration.

---

## Incident Detection & Alerting

The monitoring stack includes Grafana Alerting to detect backend service failures automatically.

Alert Rule:

```promql
time() - container_last_seen{name="opslab-backend"}
```

## Threshold:

```
> 10 seconds
```

## Evaluation:

```
Every 10 seconds
```

This rule simulates a real-world operational incident workflow where a service becomes unavailable and requires operator attention.

## Alert Lifecycle

### 1. Normal State

![Alert Normal](assets/screenshots/09-grafana-alert-rule-normal.png)

The backend container is healthy and visible to cAdvisor.Alert status remains **Normal**.---

### 2. Pending State

![Alert Pending](assets/screenshots/10-grafana-alert-rule-pending.png)

The backend container is intentionally stopped.Grafana detects the issue and starts the pending evaluation period before escalating the alert.---

### 3. Firing State

![Alert Firing](assets/screenshots/11-grafana-alert-rule-firing.png)

The backend container remains unavailable beyond the configured threshold.Grafana changes the alert state to **Firing**, indicating that operator action is required.---

### 4. Recovery State

![Alert Recovered](assets/screenshots/12-grafana-alert-rule-recovered.png)

The backend service is restored.Grafana automatically returns the alert state to **Normal** after metrics become available again.---

### Incident Workflow

```text  
Backend Running
       ↓
Backend Stopped
       ↓
Pending
       ↓
Firing
       ↓
Backend Restarted
       ↓
Recovered
```



This demonstrates a complete monitoring and incident-response lifecycle using:

- cAdvisor
- Prometheus
- Grafana
- Grafana Alerting

## What I Learned

* Reverse proxy architecture using NGINX
* Docker networking and service discovery
* Container orchestration with Docker Compose
* Backend integration with PostgreSQL and Redis
* Infrastructure monitoring using Prometheus and Grafana
* Operational troubleshooting using logs and metrics
* Incident simulation and service recovery workflows
* Observability fundamentals for Platform Engineering and IT Operations
* Grafana Alert Rule creation  
* Alert lifecycle management (Normal → Pending → Firing → Recovered)  
* Incident detection using Prometheus metrics  
* Monitoring-driven troubleshooting workflows

---

## Future Improvements

Planned enhancements:

* Email / Discord / Slack alert notifications  
* GitHub Actions CI/CD  
* Container health monitoring automation  
* Centralized logging (Loki / ELK)  
* Infrastructure as Code (Terraform)  
* Cloud deployment practice (AWS / Azure)  
* Kubernetes migration experiment

```

```
