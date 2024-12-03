import express from 'express';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';
import { db, initDatabase, insertMockData } from '../db.js';
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

// Construct equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure 'uploads' directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create the directory if it doesn't exist
    console.log(`Created uploads directory at: ${uploadsDir}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads'); // Save files to the 'uploads' folder
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName); // Ensure a unique file name
    }
});
const upload = multer({ storage });

// Middleware
app.use(cors());
app.use(express.json());

// Initialize the database
initDatabase();

// insert mock data
insertMockData();

// Basic route to test server and database
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server is running and database is initialized!' });
});

app.post('/upload-audio', upload.single('audio'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const filePath = path.join('uploads', req.file.filename);
        const duration = parseInt(req.body.duration);

        // Insert the file path and duration into the database
        const stmt = db.prepare('INSERT INTO audio_feedback (file_path, duration)' +
            ' VALUES (?, ?)');
        stmt.run(filePath, duration);

        return res.status(200).json({ message: 'Audio uploaded successfully!', filePath, duration });
    } catch (err) {
        console.error('Error uploading audio:', err);
        return res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});