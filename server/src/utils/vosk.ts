import fs from 'fs';
import { Model, Recognizer, type GrammarRecognizerParam, type SpeakerRecognizerParam, type XOR, type Result, type BaseRecognizerParam } from 'vosk';

export function loadModel(modelPath: string): Model {
    if (!fs.existsSync(modelPath)) {
        throw new Error(`Model not found at path: ${modelPath}`);
    }
    return new Model(modelPath);
}

export function createRecognizer<T extends XOR<SpeakerRecognizerParam, Partial<GrammarRecognizerParam>>>(
    model: Model, sampleRate: number
): Recognizer<T> {
    // @ts-ignore
    return new Recognizer<T>({ model, sampleRate });
}

export async function processAudio<T extends XOR<SpeakerRecognizerParam, Partial<GrammarRecognizerParam>>>(
    recognizer: Recognizer<T>, buffer: Buffer
): Promise<Result<T>> {
    recognizer.acceptWaveform(buffer);
    const result = recognizer.finalResult();
    recognizer.free();
    return result;
}