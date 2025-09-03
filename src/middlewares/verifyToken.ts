import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../types/CustomRequest";
import * as jwt from "jsonwebtoken";
import * as userRepository from "../repositories/userRepositories";

export default async function verifyToken(
  req: CustomRequest,
  res: Response,
  next: NextFunction
) {
  const authorization = req.headers.authorization;

  ("JWT token-123");

  if (authorization?.split(" ")[0] === "JWT") {
    const token = authorization.split(" ")[1];

    jwt.verify(token, process.env.SECRET_AUTH ?? "", async (err, decoded) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, message: "Token Invalid" });
      }

      const data = decoded as { id: string };

      const user = await userRepository.getUserById(data.id);

      req.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.role,
      };

      next();
    });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Token not provided" });
  }
}
