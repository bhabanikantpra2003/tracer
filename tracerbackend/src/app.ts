import express from 'express';
import morgan from 'morgan';
import { Request, Response } from 'express';
import userRouter from './routes/userRouter';
import imageRouter from './routes/ImageRouter';
import cors from 'cors';
import cookieParser from 'cookie-parser';
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(morgan('dev'));
app.use(express.json());
app.get('/', (req: Request, res: Response) => {
  res.status(201).json({
    data: 'message is shown successfully',
  });
});
app.use('/api/v1/users', userRouter);
app.use('/api/v1/images', imageRouter);
export default app;
