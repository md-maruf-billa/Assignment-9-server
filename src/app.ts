import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import manageResponse from './app/utils/manageRes';
import { NextFunction } from 'express';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import cookieParser from "cookie-parser"
import appRouter from './router';
const app: Application = express()

// middlewares
app.use(cors())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))


// routes
app.use("/api", appRouter)

// stating point

app.get("/", (req: Request, res: Response) => {
    manageResponse(res, {
        success: true,
        message: "Server is running successfully",
        statusCode: 200,
    })
})

// global error handler
app.use(globalErrorHandler)
app.use((req: Request, res: Response, nex: NextFunction) => {
    res
        .status(404)
        .json({
            success: false,
            message: "API not found!",
            error: {
                path: req.originalUrl
            }
        })
})


export default app;