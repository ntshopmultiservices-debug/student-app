const sql = require('mssql/msnodesqlv8');

const masterCS = 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=master;Trusted_Connection=yes;';
const dbCS = 'Driver={ODBC Driver 17 for SQL Server};Server=(localdb)\\MSSQLLocalDB;Database=student_db;Trusted_Connection=yes;';

async function setup() {
    try {
        let pool = await new sql.ConnectionPool({ connectionString: masterCS }).connect();
        
        await pool.request().query(`
            IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'student_db')
            BEGIN
                CREATE DATABASE [student_db];
            END
        `);
        await pool.close();

        pool = await new sql.ConnectionPool({ connectionString: dbCS }).connect();

        await pool.request().query(`
            IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='students' and xtype='U')
            BEGIN
                CREATE TABLE students (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    full_name NVARCHAR(255) NOT NULL,
                    email NVARCHAR(255) NOT NULL UNIQUE,
                    phone NVARCHAR(50),
                    dob DATE,
                    department NVARCHAR(100),
                    created_at DATETIME DEFAULT GETDATE()
                );
            END
        `);

        console.log('Database and table schema created successfully in MSSQLLocalDB!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

setup();
