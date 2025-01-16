import { Request, Response, NextFunction } from "express";
import userModel from "../models/user_model";
import postModel from "../models/post_model";
import commentModel from "../models/comment_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { OAuth2Client } from "google-auth-library";
import { deleteFileFromPath } from "../utils/functions";

type TokenPayload = {
  _id: string;
};

const register = async (req: Request, res: Response, next: Function) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;

  if (!username || !password || !email || !f_name || !l_name) {
    res.status(400).send("missing fields");
    await deleteFileFromPath(req.file?.path);
    return;
  }

  if (await userModel.findOne({ email: email })) {
    res.status(401).send("email already exists");
    await deleteFileFromPath(req.file?.path);
    return;
  }
  if (await userModel.findOne({ username: username })) {
    res.status(402).send("username already exists");
    await deleteFileFromPath(req.file?.path);
    return;
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await userModel.create({
    username: username,
    password: hashedPassword,
    email: email,
    f_name: f_name,
    l_name: l_name,
    picture: req.file ? req.file.path : null,
    likedPosts: [],
    refreshTokens: [],
  });

  const userId: string = newUser._id.toString();
  const tokens = generateTokens(userId);

  if (tokens) {
    newUser.refreshTokens.push(tokens.refreshToken);
    await newUser.save();
    res.status(200).send({
      user: newUser,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
};

const googleLogin = async (req: Request, res: Response): Promise<void> => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );
  const { code }: { code: string } = req.body;
  try {
    if (!code) {
      res.status(400).send("Invalid code");
      return;
    }
    const response = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: response.tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      res.status(400).send("Invalid payload");
      return;
    }

    const email = payload.email;
    if (!email) {
      res.status(400).send("Invalid email");
      return;
    }
    const user = await userModel.findOne({
      email: { $regex: new RegExp(`^${email}$`, "i") },
    });
    if (!user) {
      const newUser = await userModel.create({
        username: uuid(),
        password: uuid(),
        email: email,
        f_name: payload.given_name,
        l_name: payload.family_name,
        picture: payload.picture,
        likedPosts: [],
        refreshTokens: [],
      });
      const tokens = generateTokens(newUser._id.toString());
      if (tokens) {
        newUser.refreshTokens.push(tokens.refreshToken);
        await newUser.save();
        res.status(200).send({
          user: newUser,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      }
    } else {
      const tokens = generateTokens(user._id.toString());
      if (tokens) {
        user.refreshTokens.push(tokens.refreshToken);
        await user.save();
        res.status(200).send({
          user: user,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
        });
      }
    }
  } catch (error: any) {
    res.status(500).send(error.message);
  }
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
  const userId = req.params.userId;
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

const getSettings = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    res.status(400).send("user not found");
    return;
  }
  res.status(200).send({
    username: user.username,
    email: user.email,
    f_name: user.f_name,
    l_name: user.l_name,
    picture: user.picture,
    likedPosts: user.likedPosts,
  });
};

const updateUser = async (req: Request, res: Response) => {
  const userId = req.query.userId;
  const username = req.body.username;
  const f_name = req.body.f_name;
  const l_name = req.body.l_name;
  const user = await userModel.findOne({ _id: userId });
  if (!user) {
    res.status(400).send("user not found");
    await deleteFileFromPath(req.file?.path);
    return;
  }
  if (username) {
    if (user.username !== username) {
      const userExists = await userModel.findOne({ username: username });
      if (userExists) {
        res.status(401).send("username already exists");
        await deleteFileFromPath(req.file?.path);
        return;
      }
      user.username = username;
    }
  }
  let picture: string | undefined | null = user.picture;
  if (req.file) {
    await deleteFileFromPath(user.picture);
    picture = req.file.path;
    user.picture = picture;
  }
  if (f_name) user.f_name = f_name;
  if (l_name) user.l_name = l_name;

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

  const posts = await postModel.find({ user: userId });
  for (let i = 0; i < posts.length; i++) {
    await deleteFileFromPath(posts[i].picture);
    await commentModel.deleteMany({ post: posts[i]._id });
  }
  await postModel.deleteMany({ user: userId });

  await deleteFileFromPath(user.picture);
  await commentModel.deleteMany({ user: userId });
  await userModel.deleteOne({ _id: userId });

  res.status(200).send("user deleted");
};

export default {
  register,
  googleLogin,
  login,
  logout,
  refresh,
  getUser,
  getSettings,
  updateUser,
  deleteUser,
};
