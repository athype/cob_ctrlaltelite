import { parentPort } from 'worker_threads';
import { readFile } from 'fs/promises';
import { loadModel, createRecognizer, processAudio } from './vosk.ts';

// const model = loadModel('./static/models/vosk-model-en-us-0.22');
const model = loadModel('./static/models/vosk-model-small-en-us-0.15');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let currentQueueItem = null;
let isItemRequested = false;

parentPort?.on('message', (message) => {
    console.log('Message from parent:', message);
    if (message === 'empty_queue') {
        sleep(1000).then(reset);
    } else {
        currentQueueItem = message;
    }
});

const requestItem = async () => {
    if (isItemRequested) {
        await sleep(100);
        return;
    }
    isItemRequested = true;
    console.log('Requesting item...');
    parentPort?.postMessage('item_request');
    await sleep(500);
};

const updateItem = (status, result) => {
    if (!currentQueueItem) return;
    parentPort?.postMessage({ status, hash: currentQueueItem.hash, result });
};

const processItem = async () => {
    console.log('Processing item...');
    updateItem('processing');

    try {
        const audio = await readFile(currentQueueItem.path);
        const recognizer = createRecognizer(model, 16000);
        const result = await processAudio(recognizer, audio);

        updateItem('completed', result);
    } catch (error) {
        console.error('Error processing item:', error);
        updateItem('failed');
    }
};

const reset = () => {
    console.log('Resetting...');
    currentQueueItem = null;
    isItemRequested = false;
};

const processData = async () => {
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