import { db } from '../db.js';

/**
 * Retrieves all audio feedback records from the database.
 * @returns {Object[]} An array of audio feedback objects.
 */
export function getAllAudioFeedback() {
    const stmt = db.prepare('SELECT id, name, file_path, created_at, duration FROM audio_feedback');
    return stmt.all();
}

/**
 * Retrieves a single audio feedback record by its ID.
 * @param {number} id - The ID of the audio feedback.
 * @returns {Object|undefined} The audio feedback object if found, otherwise undefined.
 */
export function getAudioFeedbackById(id) {
    const stmt = db.prepare('SELECT file_path FROM audio_feedback WHERE id = ?');
    return stmt.get(id);
}

/**
 * Saves a new audio feedback record in the database.
 * @param {string} filePath - The file path of the audio file.
 * @param {number} duration - The duration of the audio in seconds.
 * @param {string} name - The name/title of the audio feedback.
 * @returns {void}
 */
export function saveAudioFeedback(filePath, duration, name) {
    const stmt = db.prepare('INSERT INTO audio_feedback (name, file_path, duration) VALUES (?, ?, ?)');
    stmt.run(name, filePath, duration);
}