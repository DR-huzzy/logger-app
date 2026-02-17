import express from 'express';
import { loginUser , refreshToken} from '../Controllers/authController';

//auth router
export const aRouter = express.Router();

aRouter.route('/login')
    .post(loginUser);

aRouter.route('/refresh')
    .post(refreshToken);




