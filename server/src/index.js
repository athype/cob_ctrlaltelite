import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initDatabase } from './db.js';

import audioFeedbackRoutes from './routes/audioFeedbackRoutes.js';
import textFeedbackRoutes from './routes/textFeedbackRoutes.js';
import transcriptionRoutes from "./routes/transcriptionRoutes.js";
import videoFeedbackRoutes from './routes/videoFeedbackRoutes.js'

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadsDir}`);
}

const videosDir = path.join(__dirname, 'videos');
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
    console.log(`Created uploads directory at: ${videosDir}`);
}


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));
app.use('/videos', express.static(videosDir));

initDatabase();

/**
 * Base route to test if the server is running.
 */
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running and database is initialized!' });
});

app.use(audioFeedbackRoutes);
app.use(textFeedbackRoutes);
app.use(transcriptionRoutes);
app.use(videoFeedbackRoutes);

/**
 * Starts the Express server and listens on the specified port.
 */
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
