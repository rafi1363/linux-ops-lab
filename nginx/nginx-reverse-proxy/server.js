const http = require('http');

const host = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');

  if (req.url === '/') {
    res.statusCode = 200;
    res.end(
`Home Route

Request URL: ${req.url}
Backend bind: ${host}:${port}
Host: ${req.headers.host}
X-Real-IP: ${req.headers['x-real-ip'] || '-'}
X-Forwarded-For: ${req.headers['x-forwarded-for'] || '-'}
X-Forwarded-Proto: ${req.headers['x-forwarded-proto'] || '-'}
`
    );
    return;
  }

  if (req.url === '/test') {
    res.statusCode = 200;
    res.end(
`Test Route

Request URL: ${req.url}
This route is handled by Node.js backend.
`
    );
    return;
  }

  if (req.url === '/api') {
    res.statusCode = 200;
    res.end(
`API Root

Request URL: ${req.url}
Message: API endpoint is reachable through NGINX reverse proxy.
`
    );
    return;
  }

  if (req.url === '/api/users') {
    res.statusCode = 200;
    res.end(
`API Users

Request URL: ${req.url}
Users:
- Rafi
- Admin
- Guest
`
    );
    return;
  }

  res.statusCode = 404;
  res.end(
`404 Not Found

Request URL: ${req.url}
This path does not exist in Node.js backend.
`
  );
});

server.listen(port, host, () => {
  console.log(`Node.js backend running at http://${host}:${port}`);
});
