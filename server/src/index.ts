import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';
import { audio } from './handlers/index.js';
import 'dotenv/config';

const app = new Hono();

app.use('/static/*', serveStatic({ root: './' }));

app.route('/audio', audio);

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port
});
