import express from 'express';
import { createLog, retrieveLog, getLog ,updateLog, deleteLog } from '../Controllers/logControllers';
import { protect, restrict, requirePasscode } from '../Controllers/authController';

export const router = express.Router();

router.route('/')
    .get(protect, retrieveLog)
    .post(protect, createLog)
    
router.route('/:id')
    .get(protect, getLog)
    .patch(protect, updateLog)
    .delete(protect, restrict('ADMIN'), requirePasscode, deleteLog);

