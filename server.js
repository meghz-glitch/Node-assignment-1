const http = require("http");
const fs = require("fs");
const url = require("url");

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    res.writeHead(200, { "Content-Type": "text/html" });

    if (path === "/") {
        res.end(`
            <h1>Welcome to My Node Server</h1>
            <p>Navigate to:</p>
            <ul>
                <li><a href="/about">About Page</a></li>
                <li><a href="/contact">Contact Page</a></li>
                <li><a href="/data">Data from File</a></li>
                <li><a href="/users?name=Alice">User Query Example</a></li>
            </ul>
        `);
    } else if (path === "/about") {
        fs.readFile("./content/about.html", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading About page.");
            } else {
                res.end(data);
            }
        });
    } else if (path === "/contact") {
        fs.readFile("./content/contact.html", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading Contact page.");
            } else {
                res.end(data);
            }
        });
    } else if (path === "/data") {
        fs.readFile("./content/data.txt", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading data.");
            } else {
                res.end(`<pre>${data}</pre>`);
            }
        });
    } else if (path === "/users") {
        fs.readFile("./content/users.json", "utf8", (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end("Error loading users.");
            } else {
                const users = JSON.parse(data);
                const userName = query.name;
                const user = users.find(u => u.name.toLowerCase() === userName.toLowerCase());

                res.end(user ? `<h1>User Found: ${user.name}</h1><p>Age: ${user.age}</p>` 
                            : "<h1>User not found</h1>");
            }
        });
    } else {
        res.writeHead(404);
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
