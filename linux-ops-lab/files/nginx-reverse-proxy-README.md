# NGINX Reverse Proxy Lab

Hands-on lab: NGINX as a reverse proxy sitting in front of a Node.js backend.

---

## Goal

Make NGINX the only public-facing entry point, while keeping the Node.js backend accessible only from localhost.

**What this simulates:** A real production pattern where backend services are never exposed directly to the network. Only the reverse proxy is public.

---

## Architecture

```
Client (browser / curl / mobile)
        |
        | HTTP :80
        v
   NGINX (0.0.0.0:80)          ← public-facing, accessible from LAN
        |
        | proxy_pass
        v
 Node.js (127.0.0.1:3000)      ← private, only reachable from localhost
```

Key point: port 3000 is **not** opened in UFW. The only way to reach the backend is through NGINX.

---

## Files

```
nginx-reverse-proxy/
├── server.js          # Node.js backend with multiple routes
└── README.md
```

NGINX config lives at `/etc/nginx/sites-available/node-lab` on the host machine. A backup is in `nginx/config-backup/`.

---

## NGINX Configuration

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Why these headers matter:**

- `X-Real-IP` — passes the actual client IP to the backend. Without this, the backend only sees NGINX's loopback address.
- `X-Forwarded-For` — chain of IPs if there are multiple proxies.
- `X-Forwarded-Proto` — tells the backend whether the original request was HTTP or HTTPS.

When accessing the backend directly (`curl 127.0.0.1:3000`), these headers are empty. When going through NGINX, they're populated — which is how you can verify the proxy is working correctly.

---

## Node.js Backend Routes

The backend (`server.js`) has multiple routes to test path forwarding:

| Route         | Expected Response                 |
| ------------- | --------------------------------- |
| `/`           | Home route, shows request headers |
| `/test`       | Simple test route                 |
| `/api`        | API root endpoint                 |
| `/api/users`  | Returns a user list               |
| anything else | 404 from Node.js                  |

---

## Firewall State During This Lab

```
sudo ufw status numbered
```

```
[ 1] 22/tcp    ALLOW IN    Anywhere   ← SSH
[ 2] 80/tcp    ALLOW IN    Anywhere   ← NGINX (public)
```

Port 3000 is intentionally absent. This enforces that the backend is unreachable from outside.

---

## Verification Commands

```bash
# Check what's listening where
ss -tulpn | grep -E ':80|:3000'

# Expected output:
# tcp LISTEN 0.0.0.0:80   → NGINX (public)
# tcp LISTEN 127.0.0.1:3000 → Node.js (private)

# Test backend directly (should work)
curl 127.0.0.1:3000

# Test backend via LAN IP directly (should FAIL)
curl 192.168.0.104:3000

# Test via NGINX (should work)
curl 192.168.0.104
```

The failure of `curl 192.168.0.104:3000` while `curl 192.168.0.104` succeeds is the proof the architecture is working correctly.

---

## Debugging 502 Bad Gateway

502 is one of the most common errors in reverse proxy setups. It does **not** mean NGINX is down.

**502 means: NGINX is running, but it cannot reach the backend.**

To reproduce: start NGINX, leave Node.js stopped, then make a request.

Diagnosis steps:

```bash
# 1. Is NGINX running?
systemctl status nginx

# 2. Is the backend listening?
ss -tulpn | grep :3000
# If nothing shows here → backend is down

# 3. Check error log
sudo tail -n 20 /var/log/nginx/error.log
```

Error log will show:

```
connect() failed (111: Connection refused) while connecting to upstream,
upstream: "http://127.0.0.1:3000/"
```

**Reading the situation from status codes:**

| `/` response       | Meaning                       |
| ------------------ | ----------------------------- |
| 200                | Both NGINX and backend are up |
| 502                | NGINX is up, backend is down  |
| Connection refused | NGINX itself is down          |

---

## NGINX Logs

```bash
# Access log — who accessed what, with what result
sudo tail -f /var/log/nginx/access.log

# Error log — why something failed
sudo tail -f /var/log/nginx/error.log
```

Sample access log entries from this lab:

```
# Request from mobile device on same LAN
192.168.0.179 - - [25/May/2026:14:50:04 +0700] "GET / HTTP/1.1" 200 115 "-" "Mozilla/5.0 (iPhone...)"

# curl from localhost
192.168.0.104 - - [25/May/2026:15:30:50 +0700] "GET / HTTP/1.1" 200 115 "-" "curl/8.5.0"

# 502 entry (backend was stopped)
192.168.0.104 - - [25/May/2026:15:28:44 +0700] "GET / HTTP/1.1" 502 166 "-" "curl/8.5.0"
```

---

## What I Learned

**The distinction that clicked:** A service can be *listening* but still unreachable — because of where it's listening (bind address) or because a firewall is blocking it. These are two separate things.

`ss -tulpn` tells you what the application decided. `ufw status` tells you what the OS allows through. Both have to be correct for a connection to work.

**The 502 mental model:** Before this lab I would have assumed any error meant "the server is down." Now I read errors more specifically — 502 tells me exactly where the failure is in the chain.

**Proxy headers as observability:** The presence or absence of `X-Real-IP` in the backend's view of a request tells you immediately whether the request came through the proxy or bypassed it. That's useful for debugging routing issues.
