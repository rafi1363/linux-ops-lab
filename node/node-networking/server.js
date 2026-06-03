const http = require("http");

const host = process.env.HOST | "127.0.0.1";
const port = process.env.PORT | 3000;

const server = http.createServer((req, res) => {
	res.end(`Hello from ${host}:${port}\n`);
});

server.listen(port, host, () => {
	console.log(`Server running on http://${host}:${port}`);
});
