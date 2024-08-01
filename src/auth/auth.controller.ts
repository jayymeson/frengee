import { Request, Response } from "express";
import { generateToken } from "./auth.middleware";

const mockUser = {
  email: "frengee@mail.com",
  password: "Abcd1234*",
};

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication management
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login and get a token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *                 example: "frengee@mail.com"
 *               password:
 *                 type: string
 *                 description: User password
 *                 example: "Abcd1234*"
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token
 *       401:
 *         description: Invalid email or password
 */
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
