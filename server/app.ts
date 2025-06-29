import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import cors from "cors";
import { ORIGIN } from "./config/config";
import { errorMiddleware } from "./middleware/error";
import indexRoute from "./routes/index.routes";
export const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ORIGIN,
  })
);
app.use("/api/v1", indexRoute);
app.all("/:path", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});
app.use(errorMiddleware);
