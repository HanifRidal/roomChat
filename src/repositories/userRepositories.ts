import { RoleType } from "../generated/prisma";
import Prisma from "../utils/prisma";
import { signUpValues } from "../utils/schema/user";

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
