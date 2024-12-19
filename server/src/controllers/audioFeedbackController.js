import path from 'path';
import { getAllAudioFeedback, getAudioFeedbackById, saveAudioFeedback } from '../services/audioFeedbackService.js';

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

export function getAudioFeedbackList(req, res) {
    const rows = getAllAudioFeedback();
    if (rows.length === 0) {
        return res.status(404).send('No audio files found.');
    }
    res.json(rows);
}

export function getSingleAudioFeedback(req, res) {
    const { id } = req.params;
    const row = getAudioFeedbackById(id);

    if (!row) {
        return res.status(404).send('Audio not found.');
    }

    res.sendFile(path.resolve(row.file_path));
}
