const express = require('express');
const sql = require('mssql/msnodesqlv8');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

// Database connection
const connectionString = 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=student_db;Trusted_Connection=yes;';

const poolPromise = new sql.ConnectionPool({ connectionString: connectionString })
  .connect()
  .then(pool => {
    console.log('Connected to MSSQL LocalDB successfully');
    return pool;
  })
  .catch(err => console.error('Database Connection Failed! Bad Config: ', err));

// Get all students
app.get('/api/students', async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM students ORDER BY created_at DESC');
        res.json(result.recordset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a student
app.post('/api/students', async (req, res) => {
    const { full_name, email, phone, dob, department } = req.body;
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('full_name', sql.NVarChar, full_name)
            .input('email', sql.NVarChar, email)
            .input('phone', sql.NVarChar, phone)
            .input('dob', sql.Date, dob || null)
            .input('department', sql.NVarChar, department)
            .query(`
                INSERT INTO students (full_name, email, phone, dob, department) 
                OUTPUT INSERTED.id
                VALUES (@full_name, @email, @phone, @dob, @department)
            `);
        res.status(201).json({ message: 'Student registered successfully', id: result.recordset[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Database error' });
    }
});

// Delete a student
app.delete('/api/students/:id', async (req, res) => {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('id', sql.Int, req.params.id)
            .query('DELETE FROM students WHERE id = @id');
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
