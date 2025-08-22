import http from 'http';
import { runCommand } from './geminiService.js';

const AUTH_TOKEN = process.env.AUTH_TOKEN;

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/api/run-command') {
    if (AUTH_TOKEN && req.headers['x-api-key'] !== AUTH_TOKEN) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Unauthorized' }));
      return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const { command, inputs, files } = JSON.parse(body || '{}');
        res.setHeader('Content-Type', 'text/plain');
        const stream = await runCommand(command, inputs, files);
        for await (const chunk of stream) {
          res.write(chunk);
        }
        res.end();
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end('Server error');
      }
    });
  } else {
    res.statusCode = 404;
    res.end();
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`API server listening on ${PORT}`);
});
