import { drizzle } from 'drizzle-orm/better-sqlite3';
import { createMiddleware } from 'hono/factory';

const middleware = createMiddleware(async (c, next) => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        throw new Error('DATABASE_URL is not defined');
    }
    const database = drizzle(databaseUrl, { logger: true });
    c.set('db', database);
    await next();
});

export default middleware;