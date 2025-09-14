const http = require("node:http");

const server = http.createServer((req, res) => {
    res.end("Welcome to the backend");
});

server.listen(3000, () => {
    console.log("Server is now up");
});