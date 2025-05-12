import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import manageResponse from './app/utils/manageRes';
import { NextFunction } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from 'cookie-parser';
import appRouter from './app/routes/router';
import notFound from './app/middlewares/notFound';
const app: Application = express();

app.use(
  cors({
    origin: ['*', 'http://localhost:3001'],
  }),
);
app.use(express.json({ limit: '50mb' }));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api', appRouter);

// stating point
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to the API !',
    data: null,
  });
});

// global error handler
app.use(globalErrorHandler);
app.use(notFound);

export default app;
