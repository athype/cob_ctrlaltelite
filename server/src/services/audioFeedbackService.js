import { db } from '../db.js';

export function getAllAudioFeedback() {
    const stmt = db.prepare('SELECT id, name, file_path, created_at, duration FROM audio_feedback');
    return stmt.all();
}

export function getAudioFeedbackById(id) {
    const stmt = db.prepare('SELECT file_path FROM audio_feedback WHERE id = ?');
    return stmt.get(id);
}

export function saveAudioFeedback(filePath, duration, name) {
    const stmt = db.prepare('INSERT INTO audio_feedback (name, file_path, duration) VALUES (?, ?, ?)');
    stmt.run(name, filePath, duration);
}
