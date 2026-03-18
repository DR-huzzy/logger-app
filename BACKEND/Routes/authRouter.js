import express from 'express';
import { loginUser , refreshToken, logOut} from '../Controllers/authController';

//auth router
export const aRouter = express.Router();

aRouter.route('/login')
    .post(loginUser);

aRouter.route('/refresh')
    .post(refreshToken);

aRouter.route('/logout')
    .post(logOut);




