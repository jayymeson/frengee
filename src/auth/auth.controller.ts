import { Request, Response } from "express";
import { generateToken } from "./auth.middleware";

const mockUser = {
  email: "frengee@mail.com",
  password: "Abcd1234*",
};

export class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    if (email === mockUser.email && password === mockUser.password) {
      const token = generateToken(email);
      res.json({ token });
    } else {
      res.status(401).send({ message: "Invalid email or password" });
    }
  }
}
