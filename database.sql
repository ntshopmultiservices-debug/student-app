IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = N'student_db')
BEGIN
    CREATE DATABASE [student_db];
END
GO

USE [student_db];
GO

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
GO
