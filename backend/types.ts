import { Request } from "express";

export interface Error {
  message: string;
  stack: string;
  statusCode: number;
}

export interface AuthenticatedRequest extends Request {
  session?: {
    userId: string;
  };
  user?: {
    id: string;
    email: string;
  };
}
