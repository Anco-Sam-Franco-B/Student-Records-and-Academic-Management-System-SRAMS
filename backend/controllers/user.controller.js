import pool from '../config/db.js';
import logger from '../config/logger.js';

export const changeUserRole = async (req, res) => {
    const { id } = req.params;
    const { role_id } = req.body;
    
    if (!role_id) {
        return res.status(400).json({ error: 'Role ID is required' });
    }

    try {
        await pool.query('BEGIN');
        
        // Update user's role
        const userResult = await pool.query(
            'UPDATE users SET role_id = $1 WHERE id = $2 RETURNING *',
            [role_id, id]
        );
        
        if (userResult.rows.length === 0) {
            await pool.query('ROLLBACK');
            return res.status(404).json({ error: 'User not found' });
        }
        
        const user = userResult.rows[0];
        
        // Get the role name
        const roleResult = await pool.query('SELECT name FROM roles WHERE id = $1', [role_id]);
        
        if (roleResult.rows.length > 0) {
            const roleName = roleResult.rows[0].name.toLowerCase();
            
            if (roleName === 'teacher') {
                // Check if already in teachers table to avoid duplicates
                const teacherCheck = await pool.query('SELECT id FROM teachers WHERE user_id = $1', [id]);
                if (teacherCheck.rows.length === 0) {
                    await pool.query(
                        'INSERT INTO teachers (user_id) VALUES ($1)',
                        [id]
                    );
                }
            }
        }
        
        await pool.query('COMMIT');
        res.status(200).json({ message: 'Role updated successfully', data: user });
    } catch (error) {
        await pool.query('ROLLBACK');
        logger.error(`Error changing user role: ${error.message}`);
        res.status(500).json({ error: 'Failed to update user role: ' + error.message });
    }
};
