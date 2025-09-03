import { Request } from "express";
import { RoleType } from "../generated/prisma";

type User = {
  id: string;
  email: string;
  name: string;
  role: RoleType;
};

export interface CustomRequest extends Request {
  user?: User | null;
}
