import { Hono } from "hono";
import { FileQueue } from "../utils/file_queue.js";
import crypto from "crypto";
import { writeFile } from "fs/promises";
import { Worker } from 'worker_threads';

// ffmpeg -i .\questions_money.wav -ar 16000 -ac 1 -b:a 256k -af highpass=f=100,afftdn=noise_reduction=20 output.wav

const app = new Hono();

const queue = new FileQueue();
const worker = new Worker('./src/utils/worker.js');

worker.on('message', (message) => {
    console.log('Received message from worker:', message);
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
    if (file) {
        return c.json({ status: file.status });
    }
    return c.json({ error: 'File not found' });
});

app.post('/', async (c) => {
    const blob = await c.req.blob();
    const buffer = Buffer.from(await blob.arrayBuffer());
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

    const path = `./temp/uploads/${hash}.wav`;
    await writeFile(path, buffer);

    queue.add({ path, hash, status: 'queued' });

    return c.json({ fileId: hash });
   
    // console.log(result);
    // return c.json(result);
});

export default app;