import express from 'express';
import { createLog, retrieveLog, updateLog, deleteLog } from '../Controllers/logControllers';
import { protect, restrict } from '../Controllers/authController';

export const router = express.Router();

router.route('/')
    .get(retrieveLog)
    .post(createLog)
    
router.route('/:id')
    .patch(updateLog)
    .delete(protect, restrict('ADMIN'), deleteLog);

