import { Request, Response } from "express";
import postModel from "../models/post_model";
import userModel from "../models/user_model";
import { Types } from "mongoose";

const createPost = async (req: Request, res: Response) => {
  const _id = req.query.userId;
  const post = {
    user: _id,
    ...req.body,
    likes: [],
  };
  req.body = post;
  try {
    const data = await postModel.create(req.body);
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  const filter = req.query;
  const data =
    Object.keys(filter).length === 0
      ? await postModel.find()
      : await postModel.find(filter);
  if (Object.keys(data).length === 0) {
    res.status(404).send("No data found");
  } else {
    res.send(data);
  }
};

const getPostById = async (req: Request, res: Response) => {
  const id = req.params.postId;
  console.log(id);
  try {
    const data = await postModel.findById(id);
    console.log(data);
    if (data) {
      return res.send(data);
    } else {
      return res.status(404).send("item not found");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const updatePost = async (req: Request, res: Response) => {
  const id = req.params.postId;
  if (req.body.likes) {
    return res.status(403).send("Cannot update likes");
  }
  try {
    const data = await postModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (data) {
      return res.send(data);
    } else {
      return res.status(404).send("item not found");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const deletePost = async (req: Request, res: Response) => {
  const id = req.params.postId;
  try {
    await postModel.findByIdAndDelete(id);
    return res.send("item deleted");
  } catch (err) {
    return res.status(400).send(err);
  }
};

const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const userId = req.query.userId as string;
  let flag = false;

  try {
    const post = await postModel.findById(postId);
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(403).send("User not found");
    }

    if (!post) {
      return res.status(404).send("Post not found");
    }

    const u_id = new Types.ObjectId(userId);
    const p_id = new Types.ObjectId(postId);

    if (post.likes.includes(u_id)) {
      // Unlike the post
      post.likes = post.likes.filter((id) => id.toString() !== userId);
      user.likedPosts = user.likedPosts.filter(
        (id) => id.toString() !== postId
      );
      flag = true;
    } else {
      // Like the post
      post.likes.push(u_id);
      user.likedPosts.push(p_id);
    }

    await post.save();
    await user.save();

    if (flag) {
      return res.send("Post unliked"); 
    } else {
      return res.send("Post liked");
    }

  } catch (err) {
    return res.status(400);
  }
};

export default {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
};
