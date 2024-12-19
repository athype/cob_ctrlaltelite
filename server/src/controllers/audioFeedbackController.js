import path from 'path';
import { getAllAudioFeedback, getAudioFeedbackById, saveAudioFeedback } from '../services/audioFeedbackService.js';

/**
 * Controller for handling audio file uploads.
 * Expects `req.file`, `req.body.duration`, and `req.body.name`.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export function uploadAudioFeedback(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.join('uploads', req.file.filename).replace('\\', '/');
        const duration = parseInt(req.body.duration, 10);
        const name = req.body.name || 'Untitled';

        if (!name || !duration) {
            return res.status(400).json({ error: 'Name and duration are required fields.' });
        }

        saveAudioFeedback(filePath, duration, name);

        return res.status(200).json({ message: 'Audio uploaded successfully!', filePath, duration, name });
    } catch (err) {
        console.error('Error uploading audio:', err);
        return res.status(500).send('Internal Server Error');
    }
}

/**
 * Controller to get a list of all audio feedback.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export function getAudioFeedbackList(req, res) {
    const rows = getAllAudioFeedback();
    if (rows.length === 0) {
        return res.status(404).send('No audio files found.');
    }
    res.json(rows);
}

/**
 * Controller to get a single audio file by ID and send it as a file response.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export function getSingleAudioFeedback(req, res) {
    const { id } = req.params;
    const row = getAudioFeedbackById(id);

    if (!row) {
        return res.status(404).send('Audio not found.');
    }

    res.sendFile(path.resolve(row.file_path));
}