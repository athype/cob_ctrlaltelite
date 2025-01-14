import { db } from '../db.js';

/**
 * Retrieves all video feedback records from the database.
 * @returns {Object[]} An array of video feedback objects.
 */
export function getAllVideoFeedback() {
    const stmt = db.prepare('SELECT id, name, file_path, created_at, duration FROM video_feedback');
    return stmt.all();
}

/**
 * Retrieves a single video feedback record by its ID.
 * @param {number} id - The ID of the video feedback.
 * @returns {Object|undefined} The video feedback object if found, otherwise undefined.
 */
export function getVideoFeedbackById(id) {
    const stmt = db.prepare('SELECT file_path FROM video_feedback WHERE id = ?');
    return stmt.get(id);
}

/**
 * Saves a new video feedback record in the database.
 * @param {string} filePath - The file path of the video file.
 * @param {number} duration - The duration of the video in seconds.
 * @param {string} name - The name/title of the video feedback.
 * @returns {void}
 */
export function saveVideoFeedback(filePath, duration, name) {
    const stmt = db.prepare('INSERT INTO video_feedback (name, file_path, duration) VALUES (?, ?, ?)');
    stmt.run(name, filePath, duration);
}