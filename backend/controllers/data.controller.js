import pool from '../config/db.js';
import logger from '../config/logger.js';

const allowedTables = [
    'students', 'teachers', 'classes', 'subjects', 
    'academic_years', 'attendance', 'assessments', 
    'trade', 'roles', 'database_backups', 'users',
    'report_cards', 'student_promotions', 'terms',
    'teacher_subjects', 'grading_system', 'marks',
    'notifications'
];

export const getTableData = async (req, res) => {
    const table = req.params.table;
    
    if (!allowedTables.includes(table)) {
        return res.status(400).json({ error: 'Invalid table specified' });
    }
    
    try {
        let query = `SELECT * FROM ${table}`;
        
        // Join with trade for better frontend display if table has trade_id
        if (['students', 'classes', 'subjects',].includes(table)) {
           query = `
             SELECT t.*, tr.name as trade_name 
             FROM ${table} t 
             LEFT JOIN trade tr ON t.trade_id = tr.id
           `;
        } else if (table === 'teachers') {
           query = `
             SELECT t.*, tr.name as trade_name, u.first_name, u.last_name, u.email, u.is_active 
             FROM teachers t 
             LEFT JOIN trade tr ON t.trade_id = tr.id
             LEFT JOIN users u ON t.user_id = u.id
           `;
        }

        const { rows } = await pool.query(query);
        res.status(200).json({ data: rows });
    } catch (error) {
        logger.error(`Error fetching data for ${table}`, { error: error.message });
        res.status(500).json({ error: 'Failed to fetch data' });
    }
};

export const createRecord = async (req, res) => {
    const table = req.params.table;
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        const query = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
        
        const { rows } = await pool.query(query, values);
        res.status(201).json({ data: rows[0], message: 'Record created successfully' });
    } catch (error) {
        logger.error(`Error creating record in ${table}`, { error: error.message });
        res.status(500).json({ error: 'Failed to create record: ' + error.message });
    }
};

export const updateRecord = async (req, res) => {
    const table = req.params.table;
    const { id } = req.params;
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });

    try {
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        
        const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const query = `UPDATE ${table} SET ${setString} WHERE id = $${keys.length + 1} RETURNING *`;
        
        const { rows } = await pool.query(query, [...values, id]);
        if (rows.length === 0) return res.status(404).json({ error: 'Record not found' });
        
        res.status(200).json({ data: rows[0], message: 'Record updated successfully' });
    } catch (error) {
        logger.error(`Error updating record in ${table}`, { error: error.message });
        res.status(500).json({ error: 'Failed to update record: ' + error.message });
    }
};

export const deleteRecord = async (req, res) => {
    const table = req.params.table;
    const { id } = req.params;
    if (!allowedTables.includes(table)) return res.status(400).json({ error: 'Invalid table' });
    try {
        const { rowCount } = await pool.query(`DELETE FROM ${table} WHERE id = $1`, [id]);
        if (rowCount === 0) {
            return res.status(404).json({ error: 'Record not found' });
        }
        res.status(200).json({ message: 'Record deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting record from ${table}`, { error: error.message });
        res.status(500).json({ error: 'Failed to delete record: ' + error.message });
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const studentCount = await pool.query('SELECT COUNT(*) FROM students');
        const teacherCount = await pool.query('SELECT COUNT(*) FROM teachers');
        const classCount = await pool.query('SELECT COUNT(*) FROM classes');
        const subjectCount = await pool.query('SELECT COUNT(*) FROM subjects');
        
        res.status(200).json({
            students: parseInt(studentCount.rows[0].count),
            teachers: parseInt(teacherCount.rows[0].count),
            classes: parseInt(classCount.rows[0].count),
            subjects: parseInt(subjectCount.rows[0].count),
        });
    } catch (error) {
        logger.error('Error fetching dashboard stats', { error: error.message });
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};
