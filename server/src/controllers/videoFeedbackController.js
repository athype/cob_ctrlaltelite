import path from "path";
import { getAllVideoFeedback, getVideoFeedbackById, saveVideoFeedback } from '../services/videoFeedbackService.js';

export function uploadVideoFeedback(req, res) {
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

        saveVideoFeedback(filePath, duration, name);

        return res.status(200).json({ message: 'Video uploaded successfully!', filePath, duration, name });
    } catch (err) {
        console.error('Error uploading audio:', err);
        return res.status(500).send('Internal Server Error');
    }
}

export function getVideoFeedbackList(req, res) {
    const rows = getAllVideoFeedback();
    if (rows.length === 0) {
        return res.status(404).send('No audio files found.');
    }
    res.json(rows);
}

export function getSingleVideoFeedback(req, res) {
    const { id } = req.params;
    const row = getAudioFeedbackById(id);

    if (!row) {
        return res.status(404).send('Audio not found.');
    }

    res.sendFile(path.resolve(row.file_path));
}