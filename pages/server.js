const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT =3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === "/") {
        serveFile(res, "./pages/home.html", "text/html");
    } else if (pathname === "/about") {
        serveFile(res, "./pages/home.html", "text/html"); 
    } else if (pathname === "/contact") {
        serveFile(res, "./pages/home.html", "text/html");
    } else if (pathname === "/style.css") {
        serveFile(res, "./public/style.css", "text/css");
    } else if (pathname === "/greet") {
        res.writeHead(200, {"Content-Type": "text/plain"});
        res.end(`Hello,${query.name || "Guest"}!`);
    } else {
        res.writeHead(404, {"Content-Type": "text/html"});
        res.end("<h1>404 - page Not Found</h1>");
    }
});

function serveFile(res, filePath, contentType) {
    fs.readFile(filePath, (err, data) => {
        if (err) {
       res.writeHead(500, {"Content-Type": "text/html"});
       res.end("<h1>500 - Server Error</h1>");
        } else {
            res.writeHead(200, {"Content-Type": contentType});
            res.end(data);
        }
    });
}

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});