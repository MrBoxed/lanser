import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../db/db";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateToken } from "../controllers/auth.controller";

const authRouter = express.Router();

// ::: localhost:PORT/api/auth/

authRouter.post("/signup", async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check for existing user
  const existingUser = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email));

  if (existingUser.length > 0) {
    return res.status(400).json({ message: "Email already registered." });
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Generate username (or use name/email if username isn't passed)
  const username = email.split("@")[0];

  // Insert user
  await db.insert(usersTable).values({
    name,
    username,
    email,
    password: hashedPassword,
  });

  return res.status(201).json({ message: "User registered successfully." });
});

authRouter.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required." });
  }

  try {
    const users = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, username));

    if (users.length === 0) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const token = generateToken({
      id: user.id,
      username: user.username || user.name,
      role: user.role ?? "user",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePic: user.profilePic,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default authRouter;
