const http = require("node:http");
const path = require("node:path");
const fs = require("node:fs");
const fresh = require("fresh");
const etag = require("etag");

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
  "Cache-Control": "max-age=3; private",
};

const server = http.createServer((req, res) => {
  const { url } = req;
  /**
   * html
   */
  if (url === "/") {
    const html = fs.readFileSync(routes["/"], "utf-8");
    const fileStat = fs.statSync(routes["/"]);
    res.writeHead(200, {
      "Content-Type": mimeTypes.html,
      "Last-Modified": fileStat.mtime.toUTCString(),
      ...cacheControl,
      // Expires: new Date(2024, 10, 10),
    });
    console.log("🚀 ~ server ~ fileStat:", fileStat.mtime.toUTCString());
    // console.log("🚀 ~ server ~ html:", html);
    res.end(html);
    return;
  }

  /**
   * js
   */
  if (url.includes("js")) {
    const js = fs.readFileSync(routes["js"], "utf-8");
    const fileStat = fs.statSync(routes["js"]);
    res.writeHead(200, {
      "Content-Type": mimeTypes.js,
      "Last-Modified": fileStat.mtime.toUTCString(),
      ...cacheControl,
      // Expires: new Date(2024, 10, 10),
    });
    // console.log("🚀 ~ server ~ js:", js);
    res.end(js);
    return;
  }

  /**
   * css
   */
  if (url.includes("css")) {
    const css = fs.readFileSync(routes["css"], "utf-8");
    const fileStat = fs.statSync(routes["css"]);
    const fileEtag = etag(fileStat);
    console.log("🚀 ~ server ~ fileEtag:", fileEtag);

    // 判断文件是否修改
    const isFresh = fresh(req.headers, {
      etag: fileEtag,
      "last-modified": fileStat.mtime.toUTCString(),
    });
    console.log("🚀 ~ server ~ isFresh:", isFresh);

    res.writeHead(isFresh ? 304 : 200, {
      "Content-Type": mimeTypes.css,
      "Last-Modified": fileStat.mtime.toUTCString(),
      Etag: fileEtag,
      // ...cacheControl,
      // Expires: new Date(2024, 10, 10),
    });
    // console.log("🚀 ~ server ~ css:", css);
    res.end(css);
    return;
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
