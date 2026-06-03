# Linux Operation Lab

Folder ini berisi semua praktik pembelajaran Linux, networking, NGINX, Docker, security, dan sertifikasi.

A self-directed Linux infrastructure lab focused on IT Operations fundamentals, including networking, NGINX reverse proxy, firewall concepts, service exposure, and troubleshooting.

## Struktur Folder

- linux/  
  Latihan Linux fundamental.

- networking/  
  Latihan IP, port, bind address, localhost, 0.0.0.0, curl, dan HTTP server sederhana.

- nginx/  
  Latihan NGINX, reverse proxy, dan backup konfigurasi.

- node/  
  Latihan Node.js server sederhana.

- docker/  
  Latihan Docker, Docker Compose, container networking, dan service isolation.

- security/  
  Latihan firewall, hardening, dan security mindset.

- certification/  
  Catatan dan latihan untuk sertifikasi seperti Linux Essentials, LPIC-1, CCNA, dan Fortinet FCF.

- notes/  
  Recap teori dan catatan pembelajaran.

- archive/  
  File lama atau eksperimen yang belum dikategorikan.

## Lab yang Sudah Dilakukan

### 1. Bind Address Lab

Folder:

networking/bind-address/

Konsep:

- 127.0.0.1 hanya bisa diakses dari mesin sendiri.
- 0.0.0.0 listen di semua interface.
- IP LAN digunakan agar device lain di jaringan bisa mengakses service.
- Firewall tetap menentukan apakah koneksi dari luar boleh masuk.

### 2. NGINX Reverse Proxy Lab

Folder:

nginx/nginx-reverse-proxy/

Konsep:

- NGINX listen di 0.0.0.0:80.
- Node.js listen di 127.0.0.1:3000.
- HP/browser mengakses NGINX lewat http://192.168.0.104.
- NGINX meneruskan request ke Node.js.
- Port 3000 tidak dibuka langsung ke jaringan.

## Pola Security

Public-facing:

- NGINX port 80
- SSH port 22

Private/internal:

- Node.js backend port 3000
- Database
- Redis
- Internal service lain
