import pool from '../config/db.js';

// Role-based access control middleware
export const authorize = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json({ error: 'Not authenticated' });
            }

            // Get user's role from database
            const result = await pool.query(
                `SELECT r.name as role_name
                 FROM users u
                 JOIN roles r ON u.role_id = r.id
                 WHERE u.id = $1`,
                [req.user.id]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({ error: 'User not found' });
            }

            const userRole = result.rows[0].role_name;

            // Check if user's role is in allowed roles
            if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    error: 'Access denied',
                    message: `Required role: ${allowedRoles.join(' or ')}. Your role: ${userRole}`
                });
            }

            // Attach role to request for use in controllers
            req.userRole = userRole;
            next();
        } catch (error) {
            return res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};

// Check if user is admin
export const isAdmin = authorize('Administrator');

// Check if user is admin or teacher
export const isAdminOrTeacher = authorize('Administrator', 'Teacher');

// Check if user is admin, teacher, or student
export const isAdminOrTeacherOrStudent = authorize('Administrator', 'Teacher', 'Student');

// Check if user owns the resource or is admin
export const isOwnerOrAdmin = (getResourceOwnerId) => {
    return async (req, res, next) => {
        try {
            if (req.userRole === 'Administrator') {
                return next();
            }

            const ownerId = await getResourceOwnerId(req);
            if (ownerId === req.user.id) {
                return next();
            }

            return res.status(403).json({ error: 'Access denied: Not owner or admin' });
        } catch (error) {
            return res.status(500).json({ error: 'Authorization check failed' });
        }
    };
};
