# linux-ops-lab

Self-directed Linux infrastructure lab — hands-on practice in server administration, networking, reverse proxy, and security fundamentals.

Built on Linux Mint (Ubuntu-based), using real services and real configurations. No simulated environments.

---

## Why This Exists

I'm transitioning into IT Operations and infrastructure. This repo documents what I've actually built and broken and fixed — not just what I've read about.

Each lab has a specific goal, real commands used, and notes on what went wrong and how it was debugged.

---

## Lab Index

| Lab                                                 | Concepts Covered                                                            | Status |
| --------------------------------------------------- | --------------------------------------------------------------------------- | ------ |
| [NGINX Reverse Proxy](./nginx/nginx-reverse-proxy/) | Reverse proxy, bind address, access/error log, 502 debugging, proxy headers | Done   |
| [Bind Address](./networking/bind-address/)          | 127.0.0.1 vs 0.0.0.0, interface binding, LAN access                         | Done   |
| [SSH Hardening](./security/ssh-hardening/)          | sshd_config, PermitRootLogin, MaxAuthTries, sshd -T verification            | Done   |
| [UFW Firewall](./security/ufw/)                     | Default deny, rule management, subnet-scoped rules                          | Done   |

---

## System Info

```
OS      : Linux Mint 22.3 (Ubuntu Noble base)
Kernel  : 6.17.0-29-generic
Shell   : Bash + Starship
Terminal: Kitty
```

---

## Folder Structure

```
linux-ops-lab/
├── networking/
│   └── bind-address/       # 127.0.0.1 vs 0.0.0.0 lab
├── nginx/
│   └── nginx-reverse-proxy/ # NGINX → Node.js reverse proxy
├── security/
│   ├── ssh-hardening/      # SSH config hardening
│   └── ufw/                # Firewall rules
├── node/                   # Supporting Node.js servers
└── notes/                  # Learning notes and session recaps
```

---

## Approach

Every lab follows the same pattern:

1. Understand the concept first
2. Build it manually — no copy-paste without understanding
3. Break it deliberately to understand failure modes
4. Verify with real commands (`ss`, `curl`, `systemctl`, logs)
5. Document what the output actually means

---

## Background

- S.Kom. in Information Technology — IBI Kesatuan Bogor (2025)
- 3 months backend outsource experience (Node.js, CI/CD monitoring, debugging)
- Currently pursuing Fortinet FCF certification
- Target roles: IT Operator, NOC, Junior Sysadmin
