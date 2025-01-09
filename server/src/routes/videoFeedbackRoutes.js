import express from 'express';
import { uploadVideoFeedback, getVideoFeedbackList, getSingleVideoFeedback } from '../controllers/videoFeedbackController.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'videos');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadsDir}`);
}
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            cb(null, uploadsDir);
        } catch (error) {
            cb(new Error('Error setting destination: ' + error.message));
        }
    },
    filename: (req, file, cb) => {
        try {
            const allowedExtensions = ['.mp4', '.webm'];
            const fileExt = path.extname(file.originalname).toLowerCase();

            if (!allowedExtensions.includes(fileExt)) {
                return cb(new Error('Invalid file type'));
            }

            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        } catch (error) {
            cb(new Error('Error setting filename: ' + error.message));
        }
    }
});
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Only video files are allowed'));
        }
    }
});

const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({
            error: true,
            message: `Upload error: ${err.message}`
        });
    }
    next(err);
};

router.use(handleMulterError);

/**
 * Route to handle file uploads for audio feedback.
 */
router.post('/upload-video', upload.single('video'), uploadVideoFeedback);

/**
 * Route to retrieve all audio feedback.
 */
router.get('/video-feedback', getVideoFeedbackList);

/**
 * Route to retrieve a single audio feedback record by ID.
 */
router.get('/video-feedback/:id', getSingleVideoFeedback);

export default router;
