import { Response } from "express";
import {
  ACCESS_TOKEN_EXPIRES,
  NODE_ENV,
  REFRESH_TOKEN_EXPIRES,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} from "../config/config";
import { redisClient } from "./redis";
import { IUser } from "../models/user.model";

interface ITokenOptions {
  expires: Date;
  maxAge: number;
  httpOnly: boolean;
  sameSite: "lax" | "strict" | "none" | undefined;
  secure: boolean;
}
export const accessTokenExpires = parseInt(ACCESS_TOKEN_EXPIRES || "300", 10);
export const refreshTokenExpires = parseInt(
  REFRESH_TOKEN_EXPIRES || "1200",
  10
);

export const commonCookieOptions = {
  httpOnly: true,
  sameSite: "none" as const,
  secure: NODE_ENV === "production",
};

export const accessTokenOptions: ITokenOptions = {
  ...commonCookieOptions,
  expires: new Date(Date.now() + accessTokenExpires * 1000),
  maxAge: accessTokenExpires * 1000,
};

export const refreshTokenOptions: ITokenOptions = {
  ...commonCookieOptions,
  expires: new Date(Date.now() + refreshTokenExpires * 1000),
  maxAge: refreshTokenExpires * 1000,
};
export const sendToken = (user: IUser, statusCode: number, res: Response) => {
  const accessToken = user.SignAccessT1oken(ACCESS_TOKEN_SECRET as string);
  const refreshToken = user.SignRefreshToken(REFRESH_TOKEN_SECRET as string);

  redisClient?.set(user._id as string, JSON.stringify({ id: user._id }));

  res.cookie("access_token", accessToken, accessTokenOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user,
  });
};
