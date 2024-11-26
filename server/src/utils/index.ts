export * from './crypto.js';
export * from './jwt.js';
export * from './vosk.js';

import path from 'path';
import { fileURLToPath } from 'url';

export const getWorkerPath = (): string => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    return path.resolve(__dirname, './worker.js');
};

export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));