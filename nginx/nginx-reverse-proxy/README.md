# NGINX Reverse Proxy Lab

**Goal:** Set up NGINX as the only public-facing entry point, with Node.js backend running privately on localhost only.

---

## Why This Setup

The Node.js backend should not be exposed directly to the network. Every open port is a potential entry point. By keeping Node.js on `127.0.0.1:3000` and only opening NGINX on port 80, there is a single controlled entry point — all traffic has to go through NGINX first.

This also means logging, header management, and access control happen at NGINX level before requests even reach the application.

---

## Architecture

```
Client (browser / curl / mobile device)
        |
        | HTTP :80  (open to network)
        v
   NGINX (0.0.0.0:80)
        |
        | proxy_pass (internal only)
        v
 Node.js (127.0.0.1:3000)  ← not reachable from outside
```

Port 3000 is intentionally not opened in UFW. The only way to reach the backend is through NGINX.

---

## Files

```
nginx-reverse-proxy/
└── server.js     # Node.js backend with multiple routes
```

NGINX config is stored at `/etc/nginx/sites-available/node-lab` on the host machine.

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

The proxy headers pass real client information to the backend. Without them, the backend only sees NGINX's loopback address — it has no way to know where the original request came from.

---

## Node.js Backend Routes

```
/           → Home route, shows request headers received from NGINX
/test       → Simple test route
/api        → API root
/api/users  → Returns user list
/*          → 404 from Node.js (not from NGINX)
```

---

## Firewall State

```
[ 1] 22/tcp   ALLOW IN   Anywhere   ← SSH
[ 2] 80/tcp   ALLOW IN   Anywhere   ← NGINX
```

Port 3000 is not in the list — intentional.

---

## How I Verified It Works

```bash
# Check what is listening and where
ss -tulpn | grep -E ':80|:3000'

# Expected:
# 0.0.0.0:80     → NGINX (accessible from network)
# 127.0.0.1:3000 → Node.js (localhost only)

# Direct backend access from localhost — should work
curl 127.0.0.1:3000

# Direct backend access via LAN IP — should FAIL
curl 192.168.0.104:3000

# Access via NGINX — should work
curl 192.168.0.104
```

The key proof: `curl 192.168.0.104:3000` fails while `curl 192.168.0.104` succeeds.
This confirms Node.js is private and NGINX is correctly proxying requests.

I also verified from a mobile device on the same Wi-Fi — the page loaded through NGINX, confirming it works across the LAN.

---

## Debugging 502 Bad Gateway

502 does not mean NGINX is down. It means NGINX is running but cannot reach the backend.

To reproduce: stop Node.js, leave NGINX running, make a request.

**My debugging steps:**

```bash
# Step 1 — Is NGINX running?
systemctl status nginx

# Step 2 — Is the backend listening?
ss -tulpn | grep :3000
# If nothing shows here, backend is down

# Step 3 — Check error log
sudo tail -n 20 /var/log/nginx/error.log
```

Error log output when backend is down:
```
connect() failed (111: Connection refused) while connecting to upstream,
upstream: "http://127.0.0.1:3000/"
```

This tells exactly what happened: NGINX is alive, but port 3000 has nothing listening.

**Reading the situation from status codes:**

| Response | Meaning |
|----------|---------|
| 200 | Both NGINX and backend are running |
| 502 | NGINX is up, backend is down |
| Connection refused on :80 | NGINX itself is down |

---

## Proxy Headers

When accessing backend directly (`curl 127.0.0.1:3000`):
```
X-Real-IP: -
X-Forwarded-For: -
X-Forwarded-Proto: -
```

When accessing through NGINX (`curl 192.168.0.104`):
```
X-Real-IP: 192.168.0.104
X-Forwarded-For: 192.168.0.104
X-Forwarded-Proto: http
```

The presence of `X-Real-IP` in the backend's view of a request confirms the request came through the proxy — useful for verifying routing is working correctly.

---

## What I Learned

**Service listening ≠ accessible.** A service can be listening but still unreachable because of where it binds (127.0.0.1 vs 0.0.0.0) or because the firewall blocks it. These are two separate things that both need to be correct.

**502 is specific information.** Before this lab I would have assumed any server error meant "something is down." Now I read 502 as: NGINX is alive, the problem is in the backend. That narrows troubleshooting immediately.

**One entry point is easier to secure.** Having only NGINX exposed means one place to configure access control, one place to check logs, one place to monitor. The backend stays clean and focused on application logic.
