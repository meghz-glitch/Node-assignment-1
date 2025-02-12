const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    if (pathname === "/") {
        res.writeHead(200, { "Pages-Type": "text/html" });
        res.end(`
            <h1>Welcome to My Page</h1>
            <p>Navigate to:</p>
            <ul>
                <li><a href="/about">About Page</a></li>
                <li><a href="/contact">Contact Page</a></li>
                <li><a href="/data">Data from File</a></li>
                <li><a href="/users?name=Merry,Albin">User Query Example</a></li>
            </ul>
        `);
    } else if (pathname === "/about") {
        fs.readFile(path.join(__dirname, "pages", "about.html"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Pages-Type": "text/plain" });
                return res.end("Error loading About page.");
            }
            res.writeHead(200, { "Pages-Type": "text/html" });
            res.end(data);
        });
    } else if (pathname === "/contact") {
        fs.readFile(path.join(__dirname, "pages", "contact.html"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Pages-Type": "text/plain" });
                return res.end("Error loading Contact page.");
            }
            res.writeHead(200, { "Pages-Type": "text/html" });
            res.end(data);
        });
    } else if (pathname === "/data") {
        fs.readFile(path.join(__dirname, "pages", "data.txt"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Pages-Type": "text/plain" });
                return res.end("Error loading data.");
            }
            res.writeHead(200, { "Pages-Type": "text/plain" });
            res.end(data);
        });
    } else if (pathname === "/users") {
        fs.readFile(path.join(__dirname, "pages", "users.json"), "utf8", (err, data) => {
            if (err) {
                res.writeHead(500, { "Pages-Type": "text/plain" });
                return res.end("Error loading users.");
            }

            try {
                const users = JSON.parse(data);
                const userName = query.name;
                const user = users.find(u => u.name.toLowerCase() === userName.toLowerCase());

                res.writeHead(200, { "Pages-Type": "text/html" });
                res.end(user ? `<h1>User Found: ${user.name}</h1><p>Age: ${user.age}</p>` 
                            : "<h1>User not found</h1>");
            } catch (parseError) {
                res.writeHead(500, { "Pages-Type": "text/plain" });
                res.end("Error parsing users data.");
            }
        });
    } else {
        res.writeHead(404, { "Pages-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
