const http = require('http');

const host = process.env.HOST || '127.0.0.1';
const port = 3000;

http.createServer((req, res) => {
  res.end(`Hello from ${host}:${port}\n`);
}).listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}`);
});
