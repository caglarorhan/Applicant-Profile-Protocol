import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  '.html': 'text/html',
  '.json': 'application/json',
  '.md': 'text/markdown',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.css': 'text/css',
  '.js': 'application/javascript',
};

function serveFile(res, filePath, contentType) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    res.end(content);
  } catch (err) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET, OPTIONS' });
    res.end();
    return;
  }

  // Routes
  if (pathname === '/') {
    serveFile(res, join(__dirname, 'public', 'index.html'), 'text/html');
  } else if (pathname === '/spec' || pathname === '/spec/1.0') {
    serveFile(res, join(__dirname, 'public', 'spec.html'), 'text/html');
  } else if (pathname === '/spec.md' || pathname === '/spec/1.0.md') {
    serveFile(res, join(__dirname, 'SPEC.md'), 'text/markdown');
  } else if (pathname === '/schema' || pathname === '/schema/app-1.0.json') {
    serveFile(res, join(__dirname, 'schema', 'app.schema.json'), 'application/json');
  } else if (pathname === '/examples/full.json') {
    serveFile(res, join(__dirname, 'examples', 'full.json'), 'application/json');
  } else if (pathname === '/examples/minimal.json') {
    serveFile(res, join(__dirname, 'examples', 'minimal.json'), 'application/json');
  } else if (pathname === '/docs' || pathname === '/docs/') {
    serveFile(res, join(__dirname, 'public', 'docs', 'index.html'), 'text/html');
  } else if (pathname === '/docs/semantic/json-ld') {
    serveFile(res, join(__dirname, 'public', 'docs', 'semantic', 'json-ld.html'), 'text/html');
  } else if (pathname === '/docs/mappings/json-resume') {
    serveFile(res, join(__dirname, 'public', 'docs', 'mappings', 'json-resume.html'), 'text/html');
  } else if (pathname === '/docs/mappings/europass') {
    serveFile(res, join(__dirname, 'public', 'docs', 'mappings', 'europass.html'), 'text/html');
  } else if (pathname === '/docs/mappings/hr-xml') {
    serveFile(res, join(__dirname, 'public', 'docs', 'mappings', 'hr-xml.html'), 'text/html');
  } else if (pathname === '/docs/aep-template') {
    serveFile(res, join(__dirname, 'public', 'docs', 'aep-template.html'), 'text/html');
  } else if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', protocol: 'APP', version: '1.0.0' }));
  } else {
    // Try to serve static files from root
    const filePath = join(__dirname, pathname);
    const ext = extname(filePath);
    if (existsSync(filePath) && MIME_TYPES[ext]) {
      serveFile(res, filePath, MIME_TYPES[ext]);
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'Not Found',
        available: [
          '/',
          '/spec/1.0',
          '/spec.md',
          '/schema/app-1.0.json',
          '/examples/full.json',
          '/examples/minimal.json',
          '/docs',
          '/docs/semantic/json-ld',
          '/docs/mappings/json-resume',
          '/docs/mappings/europass',
          '/docs/mappings/hr-xml',
          '/docs/aep-template',
          '/health'
        ]
      }));
    }
  }
});

server.listen(PORT, () => {
  console.log(`Applicant Profile Protocol (APP) v1.0.0`);
  console.log(`https://app-protocol.org`);
  console.log(`Server running on port ${PORT}`);
});
