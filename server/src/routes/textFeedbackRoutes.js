import express from 'express';
import { getTextFeedbackList, getSingleTextFeedback, createTextFeedback } from '../controllers/textFeedbackController.js';

const router = express.Router();

/**
 * Route to retrieve all text feedback records.
 */
router.get('/text-feedback', getTextFeedbackList);

/**
 * Route to retrieve a single text feedback record by ID.
 */
router.get('/text-feedback/:id', getSingleTextFeedback);

/**
 * Route to create a new text feedback record.
 */
router.post('/text-feedback', createTextFeedback);

export default router;
