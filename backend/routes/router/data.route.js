import express from 'express';
import { getTableData, getDashboardStats, createRecord, updateRecord, deleteRecord } from '../../controllers/data.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';
import { validateTableParam, validateUUIDParam } from '../../middleware/validation.js';

const dataRouter = express.Router();

// Get dashboard statistics
dataRouter.get('/stats', authenticate, getDashboardStats);

// Table CRUD with validation
dataRouter.get('/:table', authenticate, validateTableParam, getTableData);
dataRouter.post('/:table', authenticate, validateTableParam, createRecord);
dataRouter.put('/:table/:id', authenticate, validateTableParam, validateUUIDParam, updateRecord);
dataRouter.delete('/:table/:id', authenticate, validateTableParam, validateUUIDParam, deleteRecord);

export default dataRouter;
