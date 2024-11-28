import express from 'express';
import cors from 'cors';
import { initDatabase, insertMockData } from '../db.js';

const app = express();
const PORT = 3000;

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

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});