import express from 'express';
import { getTextFeedbackList, getSingleTextFeedback, createTextFeedback } from '../controllers/textFeedbackController.js';

const router = express.Router();

router.get('/text-feedback', getTextFeedbackList);
router.get('/text-feedback/:id', getSingleTextFeedback);
router.post('/text_feedback', createTextFeedback);

export default router;
