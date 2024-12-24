import {pipeline} from '@xenova/transformers';
import fs from 'fs';
import wav from 'node-wav';
import {getAudioFeedbackById} from "../services/audioFeedbackService.js";
import { execSync } from 'child_process';
import path from "path";

/**
 * Controller for sending a transcription of an audio file.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export async function getTranscription(req, res) {
    try {
        const { id } = req.params;
        const filePath = getPathToAudioFile(id);

        if (!filePath) {
            return res.status(400).json({ error: 'No file path provided.' });
        }

        const transcription = await transcribe(filePath);

        return res.status(200).json({ transcription: transcription });
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
 * @param {string} filePath - Path to the audio file.
 * @returns {Promise<string>} - Transcription of the audio file.
 */
async function transcribe(filePath) {
    const buffer = fs.readFileSync(filePath);
    const audioData = wav.decode(buffer);

    const rawAudio = audioData.channelData[0];

    const asrPipeline = await pipeline('automatic-speech-recognition', 'distil-whisper/distil-large-v3');

    const result = await asrPipeline(rawAudio, {
        sampling_rate: audioData.sampleRate,
    });

    return result.text;
}
