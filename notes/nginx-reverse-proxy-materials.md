````markdown
# Recap 3 Materi Hari Ini — NGINX Reverse Proxy, 502 Debugging, Header, dan Log

## Konteks

Hari ini pembelajaran berfokus pada NGINX sebagai reverse proxy untuk Node.js backend.

Arsitektur lab:

Client / HP / Browser / curl
↓
NGINX :80
↓
Node.js backend 127.0.0.1:3000

Tujuan utama:

- memahami kenapa backend tidak perlu dibuka langsung ke jaringan
- memahami bagaimana NGINX meneruskan request ke backend
- memahami penyebab 502 Bad Gateway
- memahami header reverse proxy
- memahami access log dan error log NGINX

---

# Materi 1 — NGINX Reverse Proxy ke Node.js Backend

## Tujuan

Membuat NGINX menjadi pintu masuk utama dari jaringan, sementara Node.js tetap private/local-only.

Target kondisi:

NGINX:
0.0.0.0:80

Node.js:
127.0.0.1:3000

Artinya:

- NGINX bisa diakses dari jaringan LAN / HP.
- Node.js hanya bisa diakses dari mesin Linux itu sendiri.

## File Node.js Backend

Lokasi:

~/labs/nginx/nginx-reverse-proxy/server.js

Catatan:

- File server.js tetap menggunakan CommonJS.
- ES Module tidak jadi dipakai.

Konsep Node.js:

```javascript
const http = require('http');

const host = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });

  res.end(
`Hello from Node.js backend

=== Request Info ===
Request URL: ${req.url}
Request Method: ${req.method}

=== Backend Info ===
Backend bind: ${host}:${port}

=== Headers from Client / NGINX ===
Host: ${req.headers.host}
User-Agent: ${req.headers['user-agent']}
X-Real-IP: ${req.headers['x-real-ip'] || '-'}
X-Forwarded-For: ${req.headers['x-forwarded-for'] || '-'}
X-Forwarded-Proto: ${req.headers['x-forwarded-proto'] || '-'}

`
  );
});

server.listen(port, host, () => {
  console.log(`Node.js backend running at http://${host}:${port}`);
});
````

Jalankan backend:

```bash
cd ~/labs/nginx/nginx-reverse-proxy
node server.js
```

## Konfigurasi NGINX

File config aktif:

/etc/nginx/sites-available/node-lab

Isi konfigurasi:

```nginx
server {
    listen 80;
    listen [::]:80;

    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;

        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Test config:

```bash
sudo nginx -t
```

Reload NGINX:

```bash
sudo systemctl reload nginx
```

## Validasi

Cek port:

```bash
ss -tulpn | grep -E ':80|:3000'
```

Hasil ideal:

* 127.0.0.1:3000 → Node.js backend private
* 0.0.0.0:80 → NGINX public-facing
* [::]:80 → NGINX IPv6

Test backend langsung:

```bash
curl 127.0.0.1:3000
```

Test backend lewat IP LAN langsung:

```bash
curl 192.168.0.104:3000
```

Hasilnya harus gagal, karena Node.js hanya bind ke 127.0.0.1.

Test lewat NGINX:

```bash
curl 192.168.0.104
```

Hasilnya harus berhasil, karena request masuk ke NGINX port 80 lalu diteruskan ke Node.js.

Kesimpulan:

* `curl 192.168.0.104:3000` gagal karena Node.js hanya listen di 127.0.0.1:3000.
* `curl 192.168.0.104` berhasil karena default HTTP memakai port 80, masuk ke NGINX, lalu NGINX meneruskan ke Node.js.

---

# Materi 2 — Debugging 502 Bad Gateway

## Arti 502 Bad Gateway

502 Bad Gateway berarti:

Client berhasil menghubungi NGINX, tetapi NGINX gagal menghubungi backend/upstream.

Dalam lab ini:

* NGINX hidup di port 80.
* Node.js mati di 127.0.0.1:3000.
* NGINX mencoba proxy_pass ke backend.
* Backend tidak tersedia.
* NGINX mengembalikan 502.

## Validasi Saat Node.js Mati

Cek port:

```bash
ss -tulpn | grep -E ':80|:3000'
```

Jika Node.js mati, yang terlihat hanya:

* 0.0.0.0:80
* [::]: 80

Cek error log:

```bash
sudo tail -n 20 /var/log/nginx/error.log
```

Contoh error:

```text
connect() failed (111: Connection refused) while connecting to upstream,
upstream: "http://127.0.0.1:3000/"
```

Maknanya:

NGINX mencoba menghubungi 127.0.0.1:3000, tetapi tidak ada service yang menerima koneksi di port tersebut.

## Kesimpulan Materi 2

* NGINX hidup + backend hidup = request berhasil.
* NGINX hidup + backend mati = 502 Bad Gateway.
* NGINX mati = client tidak bisa connect ke port 80.

Hafalan penting:

502 bukan berarti NGINX mati.
502 berarti NGINX hidup, tetapi upstream/backend bermasalah.

Checklist debugging 502:

```bash
ss -tulpn | grep -E ':80|:3000'
curl 127.0.0.1:3000
curl 192.168.0.104
sudo tail -n 20 /var/log/nginx/error.log
```

---

# Materi 3 — Header Reverse Proxy dan NGINX Log

## Test Akses Langsung ke Node.js

Command:

```bash
curl 127.0.0.1:3000
```

Output penting:

```text
Host: 127.0.0.1:3000
User-Agent: curl/8.5.0
X-Real-IP: -
X-Forwarded-For: -
X-Forwarded-Proto: -
```

Makna:

Request langsung ke Node.js.
Tidak lewat NGINX.
Karena tidak lewat reverse proxy, header X-Real-IP, X-Forwarded-For, dan X-Forwarded-Proto kosong.

## Test Akses Lewat NGINX

Command:

```bash
curl 192.168.0.104
```

Output penting:

```text
Host: 192.168.0.104
User-Agent: curl/8.5.0
X-Real-IP: 192.168.0.104
X-Forwarded-For: 192.168.0.104
X-Forwarded-Proto: http
```

Makna:

Request masuk ke NGINX.
NGINX meneruskan request ke Node.js.
NGINX menambahkan header informasi client.

## Arti Header

Host:
alamat/domain yang diminta client.

X-Real-IP:
IP client asli yang dilihat NGINX.

X-Forwarded-For:
daftar IP client/proxy yang dilewati request.

X-Forwarded-Proto:
protocol awal yang digunakan client, misalnya http atau https.

Pada lab ini, X-Forwarded-Proto bernilai http karena belum memakai HTTPS.

---

# NGINX Access Log

Command:

```bash
sudo tail -n 20 /var/log/nginx/access.log
```

Contoh dari HP:

```text
192.168.0.179 - - [25/May/2026:14:50:04 +0700] "GET / HTTP/1.1" 200 115 "-" "Mozilla/5.0 (iPhone...)"
```

Makna:

* 192.168.0.179 = IP HP
* GET / = request ke path root
* 200 = berhasil
* Mozilla/5.0 iPhone = browser dari HP

Contoh dari Linux curl:

```text
192.168.0.104 - - [25/May/2026:15:30:50 +0700] "GET / HTTP/1.1" 200 115 "-" "curl/8.5.0"
```

Makna:

* 192.168.0.104 = IP Linux Mint sendiri
* curl/8.5.0 = request berasal dari curl

Contoh 502:

```text
192.168.0.104 - - [25/May/2026:15:28:44 +0700] "GET / HTTP/1.1" 502 166 "-" "curl/8.5.0"
```

Makna:

Client berhasil menghubungi NGINX, tetapi NGINX gagal menghubungi backend.

---

# NGINX Error Log

Command:

```bash
sudo tail -n 20 /var/log/nginx/error.log
```

Contoh error:

```text
connect() failed (111: Connection refused) while connecting to upstream,
upstream: "http://127.0.0.1:3000/"
```

Makna:

NGINX gagal connect ke backend Node.js di 127.0.0.1:3000.

Access log dan error log saling melengkapi:

* access.log = siapa akses apa, hasil statusnya apa
* error.log = kenapa error terjadi

---

# Ringkasan Besar

Arsitektur:

Client / HP / Browser / curl
↓
NGINX 0.0.0.0:80
↓
Node.js 127.0.0.1:3000

Kondisi firewall:

* 22/tcp allow
* 80/tcp allow
* 3000/tcp tidak dibuka

Konsep utama:

* NGINX adalah public-facing reverse proxy.
* Node.js adalah private backend.
* Client hanya akses NGINX.
* NGINX yang menghubungi backend.

Status code:

* 200 = berhasil
* 404 = path/file tidak ditemukan
* 502 = NGINX hidup, tetapi upstream/backend bermasalah

Command penting:

```bash
ss -tulpn | grep -E ':80|:3000'
sudo ufw status numbered
curl 127.0.0.1:3000
curl 192.168.0.104:3000
curl 192.168.0.104
sudo tail -n 20 /var/log/nginx/access.log
sudo tail -n 20 /var/log/nginx/error.log
sudo nginx -t
sudo systemctl reload nginx
systemctl status nginx
```

Hafalan pendek:

* 127.0.0.1 = hanya mesin sendiri
* 0.0.0.0 = semua interface
* 80 = NGINX / HTTP
* 3000 = Node.js backend
* 502 = NGINX hidup, backend gagal
* access.log = siapa akses apa dan hasilnya apa
* error.log = kenapa error terjadi

---

# Materi Berikutnya

Materi berikutnya yang cocok:

1. Path forwarding di NGINX
   Contoh: /api, /test, /users diteruskan ke Node.js.

2. NGINX location block
   Memahami location /, location /api/, dan prioritas matching.

3. NGINX access log real-time
   Melihat request masuk saat browser/HP mengakses server.

4. Basic hardening
   Menutup akses langsung ke backend, membatasi method, dan memahami security header dasar.

````

Setelah selesai paste, simpan dengan:

```text
CTRL + O
Enter
CTRL + X
````

Lalu cek filenya:

```bash
cat ~/labs/notes/nginx-reverse-proxy-materials.md
```

Atau cek struktur:

```bash
tree ~/labs/notes -L 2
```

Kalau ingin cek cepat apakah file berhasil dibuat:

```bash
ls -lah ~/labs/notes
```
