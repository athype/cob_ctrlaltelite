import { pipeline } from '@huggingface/transformers';
import fs from 'fs';
import path from 'path';
import wavefile from 'wavefile';
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'child_process';

import { getAudioFeedbackById } from '../services/audioFeedbackService.js';
import { getVideoFeedbackById } from '../services/videoFeedbackService.js';

/**
 * SSE-based transcription for audio/video.
 * GET /transcription/:id?type=audio|video&language=en|nl
 */
export async function getTranscription(req, res) {
    try {
        const { id } = req.params;
        const { type = 'audio', language = 'en' } = req.query;

        res.on('close', () => res.end());
        res.set({
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });
        res.flushHeaders();

        let filePath;
        if (type === 'video') {
            filePath = getVideoPath(id);
        } else {
            filePath = getAudioPath(id);
        }

        if (!filePath) {
            res.write(`data: ${JSON.stringify({ error: `No ${type} file for ID=${id}` })}\n\n`);
            return res.end();
        }

        res.write(`data: ${JSON.stringify({ progress: { status: 'initializing' } })}\n\n`);
        res.flushHeaders();

        await new Promise(r => setImmediate(r));

        const text = await transcribeFile(filePath, type, language, (prog) => {
            res.write(`data: ${JSON.stringify({ progress: prog })}\n\n`);
        });

        res.write(`data: ${JSON.stringify({ transcription: text })}\n\n`);
        res.end();

    } catch (err) {
        console.error('Error in getTranscription:', err);
        if (!res.writableEnded) {
            res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
            res.end();
        }
    }
}

/**
 * Returns the path to an audio file inside 'src/uploads'.
 */
function getAudioPath(id) {
    const row = getAudioFeedbackById(id);
    if (!row) return null;
    return path.join('src', 'uploads', path.basename(row.file_path));
}

/**
 * Returns the path to a video file inside 'src/videos'.
 */
function getVideoPath(id) {
    const row = getVideoFeedbackById(id);
    if (!row) return null;
    return path.join('src', row.file_path);
}

/**
 * Reads or extracts audio data, then calls whisper pipeline with SSE progress.
 */
async function transcribeFile(filePath, type, language, onProgress) {
    onProgress({ status: 'initiate' });

    let audioFloat32;
    if (type === 'video') {
        audioFloat32 = extractAudioFromVideo(filePath, onProgress);
    } else {
        const buffer = fs.readFileSync(filePath);
        const wf = new wavefile.WaveFile(buffer);
        wf.toBitDepth('32f');
        wf.toSampleRate(16000);
        audioFloat32 = convertToMono(wf.getSamples());
    }

    // Load pipeline
    onProgress({ status: 'download' });
    const transcriber = await pipeline(
        'automatic-speech-recognition',
        'Xenova/whisper-tiny',
        { progress_callback: onProgress }
    );

    const result = await transcriber(audioFloat32, { language });
    onProgress({ status: 'done' });
    return result.text;
}

/**
 * Extracts audio from a video at 16kHz mono, returns float32 array.
 */
function extractAudioFromVideo(videoPath, onProgress) {
    onProgress({ status: 'reading_audio' });

    const ffmpegArgs = [
        '-i', videoPath,
        '-ar', '16000',
        '-ac', '1',
        '-f', 'wav',
        'pipe:1'
    ];

    // Run ffmpeg using the static binary
    const ret = spawnSync(ffmpegPath, ffmpegArgs, { encoding: 'buffer' });
    if (ret.error) {
        throw new Error(`ffmpeg error: ${ret.error.message}`);
    }
    if (ret.status !== 0) {
        const stderr = ret.stderr?.toString() || '';
        throw new Error(`ffmpeg failed with code ${ret.status}: ${stderr}`);
    }

    // Parse WAV
    const wf = new wavefile.WaveFile(ret.stdout);
    wf.toBitDepth('32f');
    wf.toSampleRate(16000);
    return convertToMono(wf.getSamples());
}

/**
 * Converts stereo to mono, if needed.
 */
function convertToMono(samples) {
    if (!Array.isArray(samples)) {
        return samples;
    }
    if (samples.length > 1) {
        const SCALING = Math.sqrt(2);
        for (let i = 0; i < samples[0].length; i++) {
            samples[0][i] = SCALING * (samples[0][i] + samples[1][i]) / 2;
        }
    }
    return samples[0];
}
