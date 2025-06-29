import { Response } from "express";
import {
  ACCESS_TOKEN_EXPIRES,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRES,
} from "../config/config";
import { IUser } from "../models/user.model";
import { redisClient } from "./redis";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure: boolean;
}
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessT1oken();
  const refreshToken = user.SignRefreshToken();

  const accessTokenExpires = parseInt(ACCESS_TOKEN_EXPIRES || "300", 10);
  const refreshTokenExpires = parseInt(REFRESH_TOKEN_EXPIRES || "1200", 10);

  redisClient?.set(user._id as string, JSON.stringify(user) as string);

  const accessTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpires * 1000),
    maxAge: accessTokenExpires + 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  };
  const refreshTokenOptions: ITokenOptions = {
    expires: new Date(Date.now() + accessTokenExpires * 1000),
    maxAge: refreshTokenExpires + 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: true,
  };
  if (NODE_ENV !== "production") {
    accessTokenOptions.secure = true;
  }
  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);
  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};
