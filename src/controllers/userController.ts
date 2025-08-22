import { NextFunction, Request, Response } from "express";
import { signInSchema, signUpSchema } from "../utils/schema/user";
import fs from "fs";
import * as userService from "../services/userService";

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Upload photo is required",
      });
    }

    const parse = signUpSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      );

      fs.unlinkSync(req.file.path); // Delete the uploaded file if validation fails

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessage,
      });
    }

    const newUser = await userService.signUp(parse.data, req.file);
    return res.json({
      success: true,
      message: "User registered successfully",
      data: newUser,
    });
  } catch (error) {}
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessage,
      });
    }

    const data = await userService.signIn(parse.data);
    return res.json({
      success: true,
      message: "User signed in successfully",
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

export const getEmailReset = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = signInSchema.pick({ email: true }).safeParse(req.body);

    if (!parse.success) {
      const errorMessage = parse.error.issues.map(
        (err) => `${err.path} - ${err.message}`
      );

      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessage,
      });
    }

    await userService.getEmailReset(parse.data.email);

    return res.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    next(error);
  }
};
