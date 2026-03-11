import express from 'express';
import { createUser, getAllUsers, resetPassword, deleteUser } from '../Controllers/userController';
import { restrict, protect, requirePasscode } from '../Controllers/authController';
import { url } from 'node:inspector';


//user router
export const uRouter = express.Router();

uRouter.route('/create')
    .post(protect, restrict('ADMIN'), requirePasscode, createUser);

uRouter.route('/')
    .get(protect, restrict('ADMIN'), getAllUsers);

uRouter.route('/:id')
    .delete(protect, restrict('ADMIN'), requirePasscode, deleteUser);

uRouter.route('/:id/reset-password')
    .patch(protect, restrict('ADMIN'), requirePasscode, resetPassword);