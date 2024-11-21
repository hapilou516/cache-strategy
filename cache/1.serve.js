const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");

/**
 * 路由
 */
const routes = {
  "/": path.join(__dirname, "index.html"),
  js: path.join(__dirname, "js/index.js"),
  css: path.join(__dirname, "css/index.css"),
};

const mimeTypes = {
  html: "text/html",
  js: "text/javascript",
  css: "text/css",
};

const cacheControl = {
  "Cache-Control": "max-age=10; private",
};

const server = http.createServer((req, res) => {
  const { url } = req;
  /**
   * html
   */
  if (url === "/") {
    res.writeHead(200, {
      "Content-Type": mimeTypes.html,
      // ...cacheControl
      
    });

    const html = fs.readFileSync(routes["/"], "utf-8");
    console.log("🚀 ~ server ~ html:", html);
    res.end(html);
    return;
  }

  /**
   * js
   */
  if (url.includes("js")) {
    
    res.writeHead(200, {
      "Content-Type": mimeTypes.js,
      // ...cacheControl,
      Expires: new Date(2024, 10, 10).toGMTString(),
    });
    const js = fs.readFileSync(routes["js"], "utf-8");
    console.log("🚀 ~ server ~ js:", js);
    res.end(js);
    return;
  }

  /**
   * css
   */
  if (url.includes("css")) {
    res.writeHead(200, {
      "Content-Type": mimeTypes.css,
      ...cacheControl
      // Expires: new Date(2024, 10, 10),
    });
    const css = fs.readFileSync(routes["css"], "utf-8");
    console.log("🚀 ~ server ~ css:", css);
    res.end(css);
    return;
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
