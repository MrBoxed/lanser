import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { date } from "drizzle-orm/mysql-core";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN! as string) || "7d";

export function generateToken(user: {
  id: number;
  username: string;
  role: string;
}) {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET not defined");
  }

  const data = {
    id: user.id,
    username: user.username,
    role: user.role,
  };

  return jwt.sign(data, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}
