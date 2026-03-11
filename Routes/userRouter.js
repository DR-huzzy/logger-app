import express from 'express';
import { createUser, resetPassword } from '../Controllers/userController';
import { restrict, protect, requirePasscode } from '../Controllers/authController';


//user router
export const uRouter = express.Router();

uRouter.route('/create')
    .post(protect, restrict('ADMIN'), requirePasscode, createUser);

uRouter.route('/:id/reset-password')
    .patch(protect, restrict('ADMIN'), requirePasscode, resetPassword);