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
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(`
            <h1>Welcome to My Page</h1>
            <p>Navigate to:</p>
            <ul>
                <li><a href="/about">About Page</a></li>
                <li><a href="/contact">Contact Page</a></li>
                <li><a href="/text">Text</a></li>
                <li><a href="/family">View Family Tree</a></li>
                <li><a href="/family?name=Albin">Family</a></li>
            </ul>
        `);
    } else if (pathname === "/about") {
        fs.readFile(path.join(__dirname, "pages", "about.html"), "utf8", (err, text) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error loading About page.");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(text);
        });
    } else if (pathname === "/contact") {
        fs.readFile(path.join(__dirname, "pages", "contact.html"), "utf8", (err, text) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error loading Contact page.");
            }
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(text);
        });
    } else if (pathname === "/text") {
        fs.readFile(path.join(__dirname, "pages", "text.txt"), "utf8", (err, text) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error loading text.");
            }
            res.writeHead(200, { "Content-Type": "text/plain" });
            res.end(text);
        });
    } else if (pathname === "/family") {
        fs.readFile(path.join(__dirname, "pages", "family.json"), "utf8", (err, text) => {
            if (err) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                return res.end("Error loading family tree.");
            }

            try {
                const familyTree = JSON.parse(text);
                const personName = query.name;

                if (!personName) {
                    const names = familyTree.map(p => p.name).join(", ");
                    res.writeHead(200, { "Content-Type": "text/html" });
                    return res.end(`<h1>Family Tree Names</h1><p>${names}</p>`);
                }

                const person = familyTree.find(p => p.name.toLowerCase() === personName.toLowerCase());

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(person ? `<h1>Family Tree for ${person.name}</h1><p>Parents: ${person.parents.join(", ")}</p><p>Children: ${person.children.join(", ")}</p>` 
                            : "<h1>Person not found in family tree</h1>");
            } catch (parseError) {
                res.writeHead(500, { "Content-Type": "text/plain" });
                res.end("Error parsing family tree data.");
            }
        });
    } else {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end("<h1>404 - Page Not Found</h1>");
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});