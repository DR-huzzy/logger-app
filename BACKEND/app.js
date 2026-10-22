import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { router } from './Routes/logRouter';
import { aRouter } from './Routes/authRouter';
import { uRouter } from './Routes/userRouter';

const authRouter = aRouter;
const logRouter = router;
const userRouter = uRouter;

export let app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());


// Allow requests from the frontend
app.use(cors({
    //origin: 'http://localhost:5173', // Vite's default port
    origin: 'https://logger-app-henna.vercel.app',
    credentials: true, // Allow cookies to be sent
}));


// ROUTES
app.use('/api/v1/logs', logRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);