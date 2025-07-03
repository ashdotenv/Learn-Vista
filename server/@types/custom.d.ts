import { Request } from "express";
import { IUser } from "../models/user.model";
import { UploadedFile } from "express-fileupload";
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
