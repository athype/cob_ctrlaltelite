import { pipeline } from '@huggingface/transformers';
import fs from 'fs';
import wavefile from 'wavefile';
import { getAudioFeedbackById } from "../services/audioFeedbackService.js";
import path from "path";

/**
 * Controller for sending a transcription of an audio file.
 */
export async function getTranscription(req, res) {
    try {
        const { id } = req.params;

        // Grab ?language=en|nl from query params (default 'en')
        const { language = 'en' } = req.query;

        const filePath = getPathToAudioFile(id);
        if (!filePath) {
            return res.status(400).json({ error: 'No file path provided.' });
        }

        // SSE housekeeping
        res.on('close', () => res.end());
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        res.flushHeaders();

        // 1) Immediately send an SSE "initializing" message
        //    so the client sees something instantly.
        res.write(`data: ${JSON.stringify({ progress: { status: 'initializing' } })}\n\n`);
        // Make sure Node actually flushes it to the client:
        // 2) Yield to the event loop before doing synchronous reading.
        await new Promise(resolve => setImmediate(resolve));

        // 3) Now do your synchronous reading / pipeline call.
        // This can take a second, but at least "initializing" is already displayed on the client.
        const transcription = await transcribe(filePath, (progress) => {
            // streaming partial progress updates
            res.write(`data: ${JSON.stringify({ progress })}\n\n`);
        }, language);

        // 4) Send final transcription
        res.write(`data: ${JSON.stringify({ transcription })}\n\n`);
        res.end();
    } catch (err) {
        console.error('Error sending transcription:', err);
        return res.status(500).json({ error: 'Failed to send transcription.' });
    }
}

function getPathToAudioFile(id) {
    const row = getAudioFeedbackById(id);
    if (!row) {
        return null;
    }
    return path.join('src', 'uploads', path.basename(row.file_path));
}

/**
 * Helper function for transcribing an audio file.
 */
async function transcribe(filePath, onProgressCallback, language = 'en') {
    // synchronous reading & wave file conversion
    const buffer = fs.readFileSync(filePath);
    const audio = new wavefile.WaveFile(buffer);
    audio.toBitDepth('32f');
    audio.toSampleRate(16000);

    const audioData = convertToMono(audio.getSamples());

    // load pipeline, set progress_callback
    const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny', // Tiny model
        { progress_callback: onProgressCallback }
    );

    // Use the requested language, e.g. 'en' or 'nl'
    const result = await transcriber(audioData, { language });
    return result.text;
}

function convertToMono(audioData) {
    if (!Array.isArray(audioData)) {
        return audioData;
    }
    if (audioData.length > 1) {
        const SCALING_FACTOR = Math.sqrt(2);
        for (let i = 0; i < audioData[0].length; i++) {
            audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
        }
    }
    return audioData[0];
}
