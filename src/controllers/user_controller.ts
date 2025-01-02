import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import postModel from "../models/post_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type TokenPayload = {
  _id: string;
};

const register = async (req: Request, res: Response, next: Function) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const picture = req.body.picture;

  if (!username || !password || !email || !f_name || !l_name) {
    res.status(400).send("missing fields");
    return;
  }

  if (
    (await userModel.findOne({ email: email })) ||
    (await userModel.findOne({ username: username }))
  ) {
    res.status(401).send("user already exists");
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await userModel.create({
    username: username,
    password: hashedPassword,
    email: email,
    f_name: f_name,
    l_name: l_name,
    picture: picture,
    likedPosts: [],
    refreshTokens: [],
  });

  res.status(200).send(user);
};

const generateTokens = (
  _id: string
): { accessToken: string; refreshToken: string } | null => {
  const random = Math.floor(Math.random() * 1000000);
  let accessToken = "";
  let refreshToken = "";
  if (process.env.TOKEN_SECRET) {
    accessToken = jwt.sign(
      {
        _id: _id,
        random: random,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    refreshToken = jwt.sign(
      {
        _id: _id,
        random: random,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION }
    );
  }

  return { accessToken, refreshToken };
};

const login = async (req: Request, res: Response) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.status(403).send("missing fields");
    return;
  }
  const user = await userModel.findOne({ username: username });
  if (!user) {
    res.status(400).send("user does not exist");
    return;
  }
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    res.status(401).send("password is incorrect");
    return;
  }

  const userId: string = user._id.toString();
  const tokens = generateTokens(userId);

  if (tokens) {
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();
    res.status(200).send({
      username: user.username,
      _id: user._id,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
};

const logout = async (req: Request, res: Response, next: Function) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(402).send("missing refresh token");
    return;
  }

  if (process.env.TOKEN_SECRET) {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, data: any) => {
        if (err) {
          res.status(403).send("invalid token");
          return;
        }

        const payload = data as TokenPayload;

        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }

        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(401).send("invalid token");
          return;
        }

        user.refreshTokens = user.refreshTokens.filter(
          (token) => token !== refreshToken
        );
        await user.save();

        res.status(200).send("logged out");
      }
    );
  }
};

const refresh = async (req: Request, res: Response, next: Function) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    res.status(402).send("invalid token");
    return;
  }

  if (process.env.TOKEN_SECRET) {
    jwt.verify(
      refreshToken,
      process.env.TOKEN_SECRET,
      async (err: any, data: any) => {
        if (err) {
          res.status(403).send("invalid token");
          return;
        }

        const payload = data as TokenPayload;
        const user = await userModel.findOne({ _id: payload._id });
        if (!user) {
          res.status(400).send("invalid token");
          return;
        }

        if (!user.refreshTokens || !user.refreshTokens.includes(refreshToken)) {
          user.refreshTokens = [];
          await user.save();
          res.status(401).send("invalid token");
          return;
        }

        const newTokens = generateTokens(user._id.toString());
        if (newTokens) {
          user.refreshTokens = user.refreshTokens.filter(
            (token) => token !== refreshToken
          );

          user.refreshTokens.push(newTokens.refreshToken);
          await user.save();

          res.status(200).send({
            accessToken: newTokens.accessToken,
            refreshToken: newTokens.refreshToken,
          });
        }
      }
    );
  }
};

const getUser = async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await userModel.findOne({ _id: userId });
    if (!user) {
      res.status(401).send("user does not exist");
      return;
    }

    res.status(200).send({
      fullname: user.f_name + " " + user.l_name,
      picture: user.picture,
      
    });
  } catch (error) {
    res.status(500).send("error");
  }
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const username = req.body.username;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const picture = req.body.picture;
  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    res.status(400).send("user not found");
    return;
  }
  if (username) {
    if (user.username !== username) {
      const userExists = await userModel.findOne({ username: username });
      if (userExists) {
        res.status(401).send("username already exists");
        return;
      }
      user.username = username;
    }
  }
  if (f_name) user.f_name = f_name;
  if (l_name) user.l_name = l_name;
  if (picture) user.picture = picture;

  await user.save();
  res.status(200).send("user updated");
};

const deleteUser = async (req: Request, res: Response) => {
  const userId = req.query.userId;

  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    res.status(400).send("user not found");
    return;
  }

  if (user.likedPosts.length > 0) {
    for (let i = 0; i < user.likedPosts.length; i++) {
      const post = await postModel.findOne({ _id: user.likedPosts[i] });
      if (post) {
        post.likes = post.likes.filter((id) => id.toString() !== userId);
        await post.save();
      }
    }
  }

  await postModel.deleteMany({ user: userId });
  await userModel.deleteOne({ _id: userId });

  res.status(200).send("user deleted");
};

export default {
  register,
  login,
  logout,
  refresh,
  getUser,
  updateUser,
  deleteUser,
};
