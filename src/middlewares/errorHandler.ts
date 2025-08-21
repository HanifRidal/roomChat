import { NextFunction, Request, Response } from "express";
import { PrismaClientKnownRequestError } from "../generated/prisma/runtime/library";

export default function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errorCatch = error;

  console.log(error);

  if (error instanceof PrismaClientKnownRequestError) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: errorCatch?.message ?? "Something went wrong",
  });
}
