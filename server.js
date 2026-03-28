import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT || 3000);
const MIME = { ".html": "text/html; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".svg": "image/svg+xml", ".json": "application/json; charset=utf-8" };

const appConfig = () => {
  const cfg = {
    appTitle: process.env.APP_TITLE || "Taskline",
  };
  return `window.__APP_CONFIG__=${JSON.stringify(cfg)};`;
};

createServer(async (req, res) => {
  const host = req.headers.host || "localhost";
  const url = new URL(req.url || "/", `http://${host}`);
  if (url.pathname === "/app-config.js") {
    res.writeHead(200, { "Content-Type": MIME[".js"], "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate", Pragma: "no-cache", Expires: "0" });
    res.end(appConfig());
    return;
  }
  const filePath = path.join(DIST_DIR, url.pathname === "/" ? "index.html" : url.pathname.slice(1));
  try {
    const body = await readFile(filePath);
    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    res.end(body);
  } catch {
    try {
      const index = await readFile(path.join(DIST_DIR, "index.html"));
      res.writeHead(200, { "Content-Type": MIME[".html"] });
      res.end(index);
    } catch {
      res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Build output missing: dist/index.html");
    }
  }
}).listen(PORT, "0.0.0.0", () => {
  console.log(`APP_TITLE=${process.env.APP_TITLE || "Taskline"}`);
  console.log(`Taskline listening on port ${PORT}`);
});
