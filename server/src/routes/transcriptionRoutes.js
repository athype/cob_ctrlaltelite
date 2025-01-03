import express from 'express';
import {getTranscription} from "../controllers/transcriptionController.js";
const router = express.Router();

router.get('/transcription/:id', getTranscription);

export default router;