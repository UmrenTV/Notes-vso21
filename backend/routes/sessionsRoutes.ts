import express, { NextFunction, Request, Response } from "express";
import { handleErrors } from "./handleErrors";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();
const router = express.Router();

interface AuthenticatedRequest extends Request {
  session: {
    userId: string;
  };
  user: {
    id: string;
    email: string;
  };
}

// Routes
router.post(
  "/",
  requireValidCredentials,
  handleErrors(async (req: Request, res: Response) => {
    // Find the user with the given email
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });
    console.log("user found", user);

    if (!user) {
      console.log("User doesn't exist", user);
      return res.status(401).send({ error: "That user doesn't exist." });
    }

    // Check if the password matches
    const passwordMatches = await bcrypt.compare(
      req.body.password,
      user.password ?? ""
    );

    if (!passwordMatches) {
      console.log("Wrong Password", user);
      return res.status(401).send({ error: "Wrong Password" });
    }

    // Create a new session for the user
    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    // Return the session id
    return res.status(201).send({ sessionId: session.id });
  })
);

router.delete(
  "/",
  handleErrors(async (req: Request, res: Response) => {
    // Delete the session
    await prisma.session.delete({ where: { id: Number(req.body.sessionId) } });

    // Return a 204 No Content response
    return res.status(204).send();
  })
);

// Middleware
async function requireValidCredentials(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).send({ error: "Email is required" });
  }

  if (!password) {
    return res.status(400).send({ error: "Password is required" });
  }

  next();
}

async function authorizeRequest(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  // Get the authorization header
  const authorizationHeader = req.headers.authorization;

  // Check if the header is present
  if (!authorizationHeader) {
    return res.status(400).send({ error: "Missing authorization header" });
  }

  // Check if the header has the correct format
  const [bearer, sessionId] = authorizationHeader.split(" ");

  if (bearer !== "Bearer" || !sessionId) {
    return res
      .status(400)
      .send({ error: "Invalid authorization header format" });
  }

  // Find the session with the given id
  const session = await prisma.session.findUnique({
    where: { id: Number(sessionId) },
  });

  if (!session) {
    return res.status(401).send({ error: "Session not found" });
  }

  // Find the user with the id in the session
  const user = await prisma.user.findUnique({ where: { id: session.userId } });

  if (!user) {
    return res.status(404).send({ error: "User not found" });
  }

  // Set the session and user in the request
  req.session = {
    userId: String(session.userId),
  };
  req.user = {
    id: String(user.id),
    email: user.email,
  };

  next();
}

export default router;
