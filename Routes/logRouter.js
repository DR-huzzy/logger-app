import express from 'express';
import { createLog, retrieveLog, updateLog, deleteLog } from '../Controllers/logControllers';
import { protect, restrict, requirePasscode , refreshToken} from '../Controllers/authController';

export const router = express.Router();

router.route('/')
    .get(protect, retrieveLog)
    .post(protect, createLog)
    
router.route('/:id')
    .patch(updateLog)
    .delete(protect, restrict('ADMIN'), requirePasscode, deleteLog);

