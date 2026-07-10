import express from 'express';
import { getTableData, getDashboardStats, createRecord, updateRecord } from '../../controllers/data.controller.js';
import { authenticate } from '../../middleware/auth.middleware.js';

const dataRouter = express.Router();

// Get dashboard statistics
dataRouter.get('/stats', authenticate, getDashboardStats);

// Table CRUD
dataRouter.get('/:table', authenticate, getTableData);
dataRouter.post('/:table', authenticate, createRecord);
dataRouter.put('/:table/:id', authenticate, updateRecord);

export default dataRouter;
