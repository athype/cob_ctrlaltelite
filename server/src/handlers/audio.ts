import { FileQueue } from "../utils/file_queue.js";
import { getWorkerPath, hashBuffer } from "../utils/index.js";
import { Hono } from "hono";
import { Worker } from 'worker_threads';
import { writeFile } from "fs/promises";

// ffmpeg -i .\questions_money.wav -ar 16000 -ac 1 -b:a 256k -af highpass=f=100,afftdn=noise_reduction=20 output.wav

const app = new Hono();

const queue = new FileQueue();
const workerPath = getWorkerPath();
const worker = new Worker(workerPath);

worker.on('message', (message) => {
    if (message === 'item_request') {
        const item = queue.getLastQueued();
        if (item) worker.postMessage(item);
        else worker.postMessage('empty_queue');
    } else {
        const { hash, status, result } = message;
        queue.update(hash, status, result);
    }
});

app.get('/:fileId', async (c) => {
    const { fileId } = c.req.param();

    const file = queue.get(fileId);
    if (!file) {
        return c.json({ error: 'File not found' });
    }
    return c.json({ 
        status: file.status,
        result: file.result,
    });
});

app.post('/', async (c) => {
    const blob = await c.req.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());

    const hash = await hashBuffer(buffer);
    const path = `./temp/uploads/${hash}.wav`;

    await writeFile(path, buffer);

    queue.add({ path, hash, status: 'queued' });

    return c.json({ fileId: hash });
});

export default app;