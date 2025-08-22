import { signInValues, signUpValues } from "../utils/schema/user";
import * as userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mailtrap from "../utils/mailtrap";

export const signUp = async (data: signUpValues, file: Express.Multer.File) => {
  const isEmailExist = await userRepositories.emailExists(data.email);

  if (isEmailExist > 1) {
    throw new Error("Email already taken!");
  }

  const user = await userRepositories.createUser(
    {
      ...data,
      password: bcrypt.hashSync(data.password, 12),
    },
    file.filename
  );

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "1 days",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token,
  };
};

export const signIn = async (data: signInValues) => {
  const isEmailExist = await userRepositories.emailExists(data.email);

  if (isEmailExist > 1) {
    throw new Error("Email not registered");
  }

  const user = await userRepositories.findUserByEmail(data.email);

  if (!bcrypt.compareSync(data.password, user.password)) {
    throw new Error("Email or password is incorrect");
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_AUTH ?? "", {
    expiresIn: "1 days",
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo_url,
    token,
  };
};

export const getEmailReset = async (email: string) => {
  const data = await userRepositories.createPasswordReset(email);

  await mailtrap.send({
    from: {
      email: "samsul@mail.com",
      name: "Samsul Arif",
    },
    to: [{ email: email }],
    subject: "Password Reset",
    text: `Here is your password reset token: ${data.token}`, //link ke halaman front end u/ reset pass
    category: "Integration Test",
  });

  return true;
};
