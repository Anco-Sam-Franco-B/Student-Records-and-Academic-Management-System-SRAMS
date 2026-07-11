import express from 'express';
import { changeUserRole } from '../../controllers/user.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateRoleChange, validateUUIDParam } from '../../middleware/validation.js';

const userRouter = express.Router();

// Custom route for changing a user's role and handling business logic
userRouter.put('/:id/role', authenticate, validateUUIDParam, validateRoleChange, changeUserRole);

export default userRouter;
