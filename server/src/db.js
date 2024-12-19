import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// Ensure the database directory exists
const dbDirectory = path.resolve('./db');
if (!fs.existsSync(dbDirectory)) {
    fs.mkdirSync(dbDirectory, { recursive: true });
}

// Create or connect to the SQLite database
const db = new Database(path.join(dbDirectory, 'database.sqlite'), { verbose: console.log });

// Initialize the database tables
const initDatabase = () => {
    // Create audio_feedback table with name column
    db.prepare(`
        CREATE TABLE IF NOT EXISTS audio_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            duration INTEGER NOT NULL
        )
    `).run();

    // Create text_feedback table with name column
    db.prepare(`
        CREATE TABLE IF NOT EXISTS text_feedback (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            feedback_text TEXT NOT NULL,
            created_at TEXT DEFAULT (datetime('now')),
            user_id INTEGER
        )
    `).run();

    console.log('Database initialized and tables are ready.');
};

// Insert mock data for testing
const insertMockData = () => {
    const audioStmt = db.prepare('INSERT INTO audio_feedback (name, file_path, duration)' +
        ' VALUES (?, ?, ?)');
    audioStmt.run('Lecture Feedback', './audio/test1.mp3', 120);
    audioStmt.run('Project Review', './audio/test2.mp3', 95);

    const textStmt = db.prepare('INSERT INTO text_feedback (name, feedback_text, user_id)' +
        ' VALUES (?, ?, ?)');
    textStmt.run('Assignment Comments', 'Great work on the project!', 1);
    textStmt.run('Code Review', 'Consider improving your code structure.', 2);

    console.log('Mock data inserted into database.');
};

// Export functions for use in other files
export { db, initDatabase, insertMockData };