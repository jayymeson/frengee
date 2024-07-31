import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IGetUserAuthInfoRequest } from '../interfaces/user.interface';

dotenv.config();

const secretKey = process.env.JWT_SECRET_KEY as string;

if (!secretKey) {
  throw new Error("JWT_SECRET_KEY environment variable is not defined");
}

export const authenticateJWT = (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

export const generateToken = (email: string) => {
  return jwt.sign({ email }, secretKey, { expiresIn: "1h" });
};
