import express from 'express';
import { uploadAudioFeedback, getAudioFeedbackList, getSingleAudioFeedback } from '../controllers/audioFeedbackController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();

const uploadsDir = path.join(process.cwd(), 'uploads');
//const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
    console.log(`Created uploads directory at: ${uploadsDir}`);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    }
});
const upload = multer({ storage });

/**
 * Route to handle file uploads for audio feedback.
 */
router.post('/upload-audio', upload.single('audio'), uploadAudioFeedback);

/**
 * Route to retrieve all audio feedback.
 */
router.get('/audio-feedback', getAudioFeedbackList);

/**
 * Route to retrieve a single audio feedback record by ID.
 */
router.get('/audio-feedback/:id', getSingleAudioFeedback);

export default router;
