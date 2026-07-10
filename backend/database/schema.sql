-- ============================================================
-- SRAMS PostgreSQL Database Schema
-- Student Records and Academics Management System
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_type WHERE typname = 'attendance_status'
    ) THEN
        CREATE TYPE attendance_status AS ENUM (
            'PRESENT',
            'ABSENT',
            'LATE',
            'EXCUSED',
            'UNEXCUSED',
            'EARLY_LEAVE',
            'HALF_DAY',
            'SICK',
            'ON_LEAVE',
            'SUSPENDED',
            'NOT_MARKED'
        );
    END IF;
END $$;


CREATE TABLE IF NOT EXISTS roles(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(50) UNIQUE NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS trade(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 code VARCHAR(50) UNIQUE NOT NULL,
 name VARCHAR(50) UNIQUE NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 role_id UUID REFERENCES roles(id),
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL,
 email VARCHAR(255) UNIQUE NOT NULL,
 password_hash TEXT NOT NULL,
 is_active BOOLEAN DEFAULT TRUE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS academic_years(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 name VARCHAR(50) UNIQUE NOT NULL,
 start_date DATE NOT NULL,
 end_date DATE NOT NULL,
 is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS terms(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 academic_year_id UUID REFERENCES academic_years(id) ON DELETE CASCADE,
 name VARCHAR(50) NOT NULL,
 start_date DATE,
 end_date DATE,
 is_current BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS classes(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 name VARCHAR(100) NOT NULL,
 level VARCHAR(50),
 capacity INT NOT NULL
);

CREATE TABLE IF NOT EXISTS students(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 admission_no VARCHAR(50) UNIQUE NOT NULL,
 class_id UUID REFERENCES classes(id),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL,
 email VARCHAR(255) UNIQUE,
 is_active BOOLEAN DEFAULT TRUE,
 gender VARCHAR(20),
 country VARCHAR(50),
 nationality VARCHAR(30) NOT NULL,
 phone VARCHAR(20),
 date_of_birth DATE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
 code VARCHAR(20) UNIQUE,
 name VARCHAR(100) NOT NULL,
 weight NUMERIC(6,2) NOT NULL DEFAULT 100
);

CREATE TABLE IF NOT EXISTS teachers(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 user_id UUID REFERENCES users(id) UNIQUE
);

CREATE TABLE IF NOT EXISTS teacher_subjects(
 teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
 subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 class_id UUID REFERENCES classes(id),
 PRIMARY KEY(teacher_id,subject_id,class_id)
);

CREATE TABLE IF NOT EXISTS assessments(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
 subject_id UUID REFERENCES subjects(id),
 term_id UUID REFERENCES terms(id),
 title VARCHAR(150),
 total_marks NUMERIC(6,2)
);

CREATE TABLE IF NOT EXISTS grading_system(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 grade VARCHAR(5),
 min_mark NUMERIC(5,2),
 max_mark NUMERIC(5,2),
 remarks VARCHAR(140)
);

CREATE TABLE IF NOT EXISTS marks(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
 assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
 student_id UUID REFERENCES students(id) ON DELETE CASCADE,
 marks NUMERIC(6,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS attendance(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 student_id UUID REFERENCES students(id) ON DELETE CASCADE,
 teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE,
 class_id UUID REFERENCES classes(id),
 term_id UUID REFERENCES terms(id),
 subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
 attendance_date DATE NOT NULL,
 status attendance_status NOT NULL,
 UNIQUE(student_id,attendance_date)
);

CREATE TABLE IF NOT EXISTS report_cards(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id UUID REFERENCES students(id),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 term_id UUID REFERENCES terms(id),
 total_marks NUMERIC(10,2),
 average NUMERIC(5,2),
 position INTEGER,
 teacher_comment TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS student_promotions(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 student_id UUID REFERENCES students(id),
 from_class UUID REFERENCES classes(id),
 to_class UUID REFERENCES classes(id),
 academic_year_id UUID REFERENCES academic_years(id),
 status VARCHAR(30),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications(
 id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 user_id UUID REFERENCES users(id) ON DELETE CASCADE,
 trade_id UUID REFERENCES trade(id) ON DELETE CASCADE,
 title VARCHAR(255),
 message TEXT,
 is_read BOOLEAN DEFAULT FALSE,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS database_backups(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    backup_type VARCHAR(50) DEFAULT 'DAILY',
    status VARCHAR(30) DEFAULT 'COMPLETED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_students_adm ON students(admission_no);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(attendance_date);

INSERT INTO roles(name)
SELECT v FROM (VALUES ('Administrator'),('Teacher'),('Student'),('Parent')) t(v)
ON CONFLICT DO NOTHING;
