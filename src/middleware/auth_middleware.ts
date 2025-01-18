import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
    _id: string;
};

const authUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).send("missing token");
    return;
  }
  if (process.env.TOKEN_SECRET) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, data) => {
      if (err) {
        res.status(403).send("invalid token");
        return;
      }
      const payload = data as TokenPayload;
      req.query.userId = payload._id;
      next();
    });
  }
};

export { authUser };
