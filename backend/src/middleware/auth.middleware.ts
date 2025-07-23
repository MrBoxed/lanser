import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { date } from "drizzle-orm/mysql-core";
import { NextFunction, Request, Response } from "express";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN! as string) || "7d";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

// ::: FUNCTION TO GENERATE JWT TOKEN ::::
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

// ::: FUNCITON TO AUTHENTICATE THE USER :::
export function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1]; // Bearer <token>

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded as AuthenticatedRequest["user"];
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
}
