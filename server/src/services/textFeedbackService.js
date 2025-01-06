import { db } from '../db.js';

/**
 * Retrieves all text feedback records from the database.
 * @returns {Object[]} An array of text feedback objects.
 */
export function getAllTextFeedback() {
    const stmt = db.prepare('SELECT id, name, feedback_text, created_at, user_id FROM text_feedback');
    return stmt.all();
}

/**
 * Retrieves a specific text feedback record by its ID.
 * @param {number} id - The ID of the text feedback.
 * @returns {Object|undefined} The text feedback object if found, otherwise undefined.
 */
export function getTextFeedbackById(id) {
    const stmt = db.prepare('SELECT feedback_text FROM text_feedback WHERE id = ?');
    return stmt.get(id);
}

/**
 * Saves a new text feedback record in the database.
 * @param {string} feedbackText - The text of the feedback.
 * @param {string} name - The name/title of the feedback.
 * @param {number|null} [user_id=null] - The ID of the user who gave the feedback (optional).
 * @returns {void}
 */
export function saveTextFeedback(feedbackText, name, user_id = null) {
    const stmt = db.prepare('INSERT INTO text_feedback (name, feedback_text, user_id) VALUES (?, ?, ?)');
    stmt.run(name, feedbackText, user_id);
}