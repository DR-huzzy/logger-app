import express from 'express';
import morgan from 'morgan';
import { router } from './Routes/logRouter';

const logRouter = router;

export let app = express();
app.use(express.json());

app.use(morgan('dev'));



// ROUTES
app.use('/api/v1/logs', logRouter);










// TEST ROUTE
app.get('/', (req, res) => {
    res.json({ message: 'Hello, World!' });
})





