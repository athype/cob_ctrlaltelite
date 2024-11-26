import { type MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import type { JwtPayload, Permission } from '../types/index.js';

const compare = (a: Permission[], b: Permission[]): boolean => {
    return a.every((permission) => b.includes(permission));
};

const middleware = (permissions: Permission[]): MiddlewareHandler => createMiddleware(async (c, next) => {
    const payload: JwtPayload = c.get('jwtPayload');
    if (!payload || !compare(payload.permissions, permissions)) {
        return c.json({ error: 'Unauthorized' }, 401);
    }
    await next();
});

export default middleware;