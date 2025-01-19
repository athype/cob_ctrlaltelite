import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import { getAllAudioFeedback, getAudioFeedbackById, saveAudioFeedback } from '../services/audioFeedbackService.js';

/**
 * Controller for handling audio file uploads.
 * Expects `req.file`, `req.body.duration`, and `req.body.name`.
 * @param {import('express').Request} req - Express request object.
 * @param {import('express').Response} res - Express response object.
 */
export async function uploadAudioFeedback(req, res) {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.resolve('src', 'uploads', req.file.filename).replace('\\', '/');
        const outputFilePath = path.resolve('src', 'uploads', `converted_${req.file.filename}`);
        const filePathForDb  = path.join('uploads', req.file.filename).replace('\\', '/');
        const duration = parseInt(req.body.duration, 10);
        const name = req.body.name || 'Untitled';

        if (!name || !duration) {
            return res.status(400).json({ error: 'Name and duration are required fields.' });
        }

        ffmpeg.setFfmpegPath(ffmpegStatic);

        fsPromises.access(filePath, fs.constants.F_OK)
            .then(() => {
                console.log('File exists, starting FFmpeg...');

                ffmpeg(filePath)
                    .audioFrequency(16000)
                    .audioChannels(1)
                    .toFormat('wav')
                    .on('end', () => {
                        console.log('FFmpeg conversion finished');

                
                        fsPromises.unlink(filePath)
                            .then(() => {
                                fsPromises.rename(outputFilePath, filePath)
                                    .then(() => {
                                        saveAudioFeedback(filePathForDb, req.body.duration, req.body.name || 'Untitled');
                                        res.status(200).json({
                                            message: 'Audio uploaded and processed!',
                                            filePath,
                                            duration: req.body.duration,
                                            name: req.body.name || 'Untitled',
                                        });
                                    })
                                    .catch((err) => {
                                        console.error('Error renaming file:', err);
                                        res.status(500).send('Failed to rename converted file.');
                                    });
                            })
                            .catch((err) => {
                                console.error('Error deleting original file:', err);
                                res.status(500).send('Failed to delete original file.');
                            });
                    })
                    .on('error', (err) => {
                        console.error('Error processing audio:', err);
                        res.status(500).send('Audio processing failed.');
                    })
                    .save(outputFilePath);

            })
            .catch((err) => {
                console.error('File not found:', filePath, err);
                res.status(400).send('Uploaded file not found.');
            });

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