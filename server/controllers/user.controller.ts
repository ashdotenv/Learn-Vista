import { NextFunction, Request, Response } from "express";
import { catchAsyncError } from "../middleware/catchAsyncError";
import { IUser, User } from "../models/user.model";
import { ErrorHandler } from "../utils/ErrorHandler";
import jwt, { Secret } from "jsonwebtoken";
import { ACTIVATION_SECRET } from "../config/config";
import ejs from "ejs";
import path from "path";
import { sendEmail } from "../utils/sendEmail";
import { sendToken } from "../utils/jwt";

interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password } = req.body as IRegistrationBody;

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return next(new ErrorHandler("Email Already Exists", 400));
    }

    const userPayload = { name, email, password };
    const { token, activationCode } = createActivationToken(userPayload);

    const data = { user: { name }, activationCode };

    // Render the activation email template to HTML string
    const html = await ejs.renderFile(
      path.join(__dirname, "../mails/activation-mails.ejs"),
      data
    );

    try {
      await sendEmail({
        email: email,
        subject: "Activate Your Accoung",
        template: "activation-mails.ejs",
        data,
      });

      res.status(201).json({
        success: true,
        message: `Please check your email (${email}) to activate your account.`,
        activationToken: token,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

function createActivationToken(user: IRegistrationBody): IActivationToken {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
  const token = jwt.sign(
    { user, activationCode },
    ACTIVATION_SECRET as Secret,
    { expiresIn: "15d" }
  );
  return { token, activationCode };
}

interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { activation_token, activation_code } =
      req.body as IActivationRequest;

    const decoded = jwt.verify(
      activation_token,
      ACTIVATION_SECRET as string
    ) as { user: IRegistrationBody; activationCode: string };

    const { user, activationCode } = decoded;

    if (activation_code !== activationCode) {
      return next(new ErrorHandler("Invalid Activation Code", 400));
    }

    const { name, email, password } = user;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorHandler("User Already Exists", 400));
    }

    await User.create({ name, email, password });

    res.status(200).json({
      success: true,
      message: "Account Activated Successfully",
    });
  }
);
interface ILoginRequest {
  email: string;
  password: string;
}
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(
          new ErrorHandler("Please enter both Email and Password", 400)
        );
      }
      const user = await User.findOne({ email }).select("+password");
      if (!user) {
        return next(
          new ErrorHandler("User with this Email doesn't exist", 401)
        );
      }
      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Incorrect password", 401));
      }
      sendToken(user, 200, res);
    } catch (error: any) {
      console.log(error);
      return next(new ErrorHandler(error.message, 500));
    }
  }
);
export const logoutUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);
