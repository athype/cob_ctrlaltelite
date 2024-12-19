import { getAllTextFeedback, getTextFeedbackById, saveTextFeedback } from '../services/textFeedbackService.js';

export function getTextFeedbackList(req, res) {
    const rows = getAllTextFeedback();
    if (rows.length === 0) {
        return res.status(404).send('No text feedbacks found.');
    }
    res.json(rows);
}

export function getSingleTextFeedback(req, res) {
    const { id } = req.params;
    const row = getTextFeedbackById(id);

    if (!row) {
        return res.status(404).send('Text feedback not found.');
    }

    res.type('text').send(row.feedback_text);
}

export function createTextFeedback(req, res) {
    try {
        const { feedback_text, name, user_id } = req.body;

        if (!feedback_text || !name) {
            return res.status(400).json({ error: 'Name and feedback_text are required.' });
        }

        saveTextFeedback(feedback_text, name, user_id);
        return res.status(200).json({ message: 'Text feedback added successfully!', feedback_text, name, user_id });
    } catch (err) {
        console.error('Error adding text feedback to the database:', err);
        return res.status(500).send('Internal Server Error');
    }
}