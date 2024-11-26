import crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
    return await hashPassword(password) === hash;
};

export const hashBuffer = async (buffer: Buffer): Promise<string> => {
    const hash = crypto.createHash('sha256');
    hash.update(buffer);
    return hash.digest('hex');
};