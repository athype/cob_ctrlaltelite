import {pipeline} from '@huggingface/transformers';
import fs from 'fs';
import wavefile from 'wavefile';
import {getAudioFeedbackById} from "../services/audioFeedbackService.js";
import path from "path";

/**
 * Controller for sending a transcription of an audio file.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export async function getTranscription(req, res) {
    try {
        const {id} = req.params;
        const filePath = getPathToAudioFile(id);

        if (!filePath) {
            return res.status(400).json({error: 'No file path provided.'});
        }

        const transcription = await transcribe(filePath);

        return res.status(200).json({transcription: transcription});
    } catch (err) {
        console.error('Error sending transcription:', err);
        return res.status(500).json({error: 'Failed to send transcription.'});
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
    const audio = new wavefile.WaveFile(buffer);
    audio.toBitDepth('32f');
    audio.toSampleRate(16000);

    const audioData = convertToMono(audio.getSamples());

    const transcriber = await pipeline(
        'automatic-speech-recognition', 'Xenova/whisper-tiny.en'
    );

    const result = await transcriber(audioData);
    return result.text;
}

/**
 * This function converts audio to mono
 * @param {Array|TypedArray} audioData
 * @returns {TypedArray}
 */
function convertToMono(audioData) {
    if (!Array.isArray(audioData)) {
        return audioData;
    }
    if (audioData.length > 1) {
        const SCALING_FACTOR = Math.sqrt(2);

        for (let i = 0; i < audioData[0].length; ++i) {
            audioData[0][i] = SCALING_FACTOR * (audioData[0][i] + audioData[1][i]) / 2;
        }
    }

    return audioData[0];
}