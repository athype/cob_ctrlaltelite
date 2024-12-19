import { db } from '../db.js';

export function getAllTextFeedback() {
    const stmt = db.prepare('SELECT id, name, feedback_text, created_at, user_id FROM text_feedback');
    return stmt.all();
}

export function getTextFeedbackById(id) {
    const stmt = db.prepare('SELECT feedback_text FROM text_feedback WHERE id = ?');
    return stmt.get(id);
}

export function saveTextFeedback(feedbackText, name, user_id = null) {
    const stmt = db.prepare('INSERT INTO text_feedback (name, feedback_text, user_id) VALUES (?, ?, ?)');
    stmt.run(name, feedbackText, user_id);
}
