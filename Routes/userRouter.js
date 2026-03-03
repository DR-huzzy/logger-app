import express from 'express';
import { createUser } from '../Controllers/userController';
import { restrict, protect, requirePasscode } from '../Controllers/authController';


//user router
export const uRouter = express.Router();

uRouter.route('/create')
    .post(protect, restrict('ADMIN'), requirePasscode, createUser)