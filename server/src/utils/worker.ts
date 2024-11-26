import { loadModel, createRecognizer } from './vosk.js';
import { parentPort } from 'worker_threads';
import { sleep } from './index.js';
import type { FileStatus, QueuedFile } from './file_queue.js';
import { createReadStream } from 'fs';

// const model = loadModel('./static/models/vosk-model-en-us-0.22');
const model = loadModel('./static/models/vosk-model-small-en-us-0.15');

let currentQueueItem: QueuedFile | null = null;
let isItemRequested: boolean = false;

parentPort?.on('message', (message) => {
    if (message === 'empty_queue') {
        sleep(1000).then(reset);
    } else {
        currentQueueItem = message;
    }
});

const requestItem = async (): Promise<void> => {
    if (isItemRequested) {
        await sleep(100);
        return;
    }
    isItemRequested = true;
    parentPort?.postMessage('item_request');
    await sleep(500);
};

const updateItem = (status: FileStatus, result?: string): void => {
    if (!currentQueueItem) return;
    parentPort?.postMessage({ status, hash: currentQueueItem.hash, result });
};

const processItem = async (): Promise<void> => {
    if (!currentQueueItem) return;

    try {
        const recognizer = createRecognizer(model, 16000);
        const stream = createReadStream(currentQueueItem.path);

        for await (const chunk of stream) {
            await recognizer.acceptWaveformAsync(chunk);
            const { partial } = recognizer.partialResult();
            if (partial) updateItem('processing', partial);
        }

        const result = recognizer.finalResult();
        recognizer.free();

        updateItem('completed', result.text);
    } catch (error) {
        console.error('Error processing item:', error);
        updateItem('failed');
    }
};

const reset = (): void => {
    currentQueueItem = null;
    isItemRequested = false;
};

const processData = async (): Promise<void> => {
    while (true) {
        if (!currentQueueItem) {
            await requestItem();
            continue;
        }
        await processItem();
        reset();
    }
};

processData();