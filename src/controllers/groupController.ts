import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/CustomRequest";
import { groupFreeSchema } from "../utils/schema/group";
import * as groupService from "../services/groupService";
import { json } from "body-parser";

export const createfreeGroup = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const parse = groupFreeSchema.safeParse(req.body);

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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    const group = await groupService.createFreeGroup(
      parse.data,
      req.file.filename,
      req.user?.id ?? ""
    );

    return res.json({
      success: true,
      message: "Group created successfully",
      data: group,
    });
  } catch (error) {
    next(error);
  }
};
