import { NextFunction, Request, Response } from "express";
import { signUpSchema } from "../utils/schema/user";
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
