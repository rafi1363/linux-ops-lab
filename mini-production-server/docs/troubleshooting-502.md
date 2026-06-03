# Troubleshooting Case: NGINX 502 Bad Gateway

## Scenario

NGINX is running, but the backend service is stopped or unreachable.

## How to Simulate

Stop the backend container:

`docker compose stop backend`

Then test the NGINX endpoint:

`curl -i http://localhost:8080`

# Expected Symptom


NGINX should return an error because it cannot forward the request to the backend container.


# Investigation Steps


Check container status:

`docker compose ps`

Check NGINX logs:

`docker compose logs nginx`

Check backend logs:

`docker compose logs backend`

# Root Cause


NGINX is still active, but its upstream backend service is not available.

This means the issue is not always with NGINX itself. The reverse proxy can be healthy while the backend service behind it is down.


# Resolution


Start the backend service again:

`docker compose start backend
`
Verify the service:

`curl -i http://localhost:8080
curl http://localhost:8080/api/health`
#Lesson Learned

A 502 Bad Gateway error usually means the proxy cannot reach the upstream service. Troubleshooting should include checking the proxy, backend service, container status, and logs.
