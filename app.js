import express from 'express';
import morgan from 'morgan';
import { router } from './Routes/logRouter';
import { aRouter } from './Routes/authRouter';

const authRouter = aRouter;
const logRouter = router;

export let app = express();
app.use(express.json());

app.use(morgan('dev'));



// ROUTES
app.use('/api/v1/logs', logRouter);
app.use('/api/v1/auth', authRouter);










// TEST ROUTE
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
})





