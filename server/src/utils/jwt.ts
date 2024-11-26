import { sign } from 'hono/jwt';

import type { JwtPayload, User } from '../types/index.js';

export const createJwt = (user: User): Promise<string> => {
    const key = process.env.JWT_SECRET;
    if (!key) {
        throw new Error('JWT_SECRET is not defined');
    }
    return sign({
        id: user.id,
        name: user.name,
        email: user.email,
        permissions: user.permissions,
    } satisfies JwtPayload,
        key
    );
};