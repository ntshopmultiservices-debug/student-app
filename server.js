const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'student_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Check DB connection
pool.getConnection()
    .then(connection => {
        console.log('Connected to MySQL database successfully');
        connection.release();
    })
    .catch(err => {
        console.error('Error connecting to MySQL database. Ensure XAMPP/MySQL is running.');
    });

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a student
app.post('/api/students', async (req, res) => {
    const { full_name, email, phone, dob, department } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO students (full_name, email, phone, dob, department) VALUES (?, ?, ?, ?, ?)',
            [full_name, email, phone, dob, department]
        );
        res.status(201).json({ message: 'Student registered successfully', id: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Database error' });
    }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE id = ?', [req.params.id]);
        res.json({ message: 'Student deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
