import { RoleType } from "../generated/prisma";
import Prisma from "../utils/prisma";
import { signUpValues } from "../utils/schema/user";
import crypto from "node:crypto";

export const emailExists = async (email: string) => {
  return await Prisma.user.count({
    where: {
      email: email,
    },
  });
};

export const findRole = async (role: RoleType) => {
  return await Prisma.role.findFirstOrThrow({
    where: {
      role: role,
    },
  });
};

export const createUser = async (data: signUpValues, photo: string) => {
  const role = await findRole("USER");

  return await Prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role_id: role.id,
      password: data.password,
      photo,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await Prisma.user.findFirstOrThrow({
    where: {
      email,
    },
  });
};

export const createPasswordReset = async (email: string) => {
  const user = await findUserByEmail(email);

  const token = crypto.randomBytes(32).toString("hex");

  return await Prisma.passwordReset.create({
    data: {
      user_id: user.id,
      token,
    },
  });
};
