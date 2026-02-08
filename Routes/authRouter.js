import express from 'express';
import { loginUser } from '../Controllers/authController';

//auth router
export const aRouter = express.Router();

aRouter.route('/login')
    .post(loginUser);




