import { Request, Response } from "express";
import postModel from "../models/post_model";
import userModel from "../models/user_model";
import commentModel from "../models/comment_model";
import { Types } from "mongoose";
import { deleteFileFromPath } from "../utils/functions";

const createPost = async (req: Request, res: Response) => {
  const id = req.query.userId;

  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  const phone = req.body.phone;
  const region = req.body.region;
  const city = req.body.city;
  const picture = req.file ? req.file.path : null;

  if (!title || !description || !category || !phone || !region || !city) {
    res.status(400).send("Missing required fields");
    await deleteFileFromPath(req.file?.path);
    return;
  }

  const post = await postModel.create({
    user: id,
    title,
    description,
    category,
    phone,
    region,
    city,
    picture,
    likes: [],
    comments: [],
  });

  res.status(200).send(post);
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

const getPostById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.postId;
  try {
    const data = await postModel.findById(id);
    if (data) {
      res.send(data);
      return;
    } else {
      res.status(404).send("item not found");
      return;
    }
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

const updatePost = async (req: Request, res: Response): Promise<void> => {
  const postId = req.params.postId;
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  const phone = req.body.phone;
  const region = req.body.region;
  const city = req.body.city;
  const likes = req.body.likes;
  const comments = req.body.comments;
  if (likes || comments) {
    res.status(403).send("Cannot update likes or comments");
    await deleteFileFromPath(req.file?.path);
    return;
  }
  const post = await postModel.findOne({ _id: postId });
  if (!post) {
    res.status(400).send("post not found");
    await deleteFileFromPath(req.file?.path);
    return;
  }
  let picture: string | undefined | null = post.picture;
  if (req.file) {
    await deleteFileFromPath(post.picture);
    picture = req.file.path;
    post.picture = picture;
  }
  if (title) post.title = title;
  if (description) post.description = description;
  if (category) post.category = category;
  if (phone) post.phone = phone;
  if (region) post.region = region;
  if (city) post.city = city;
  await post.save();

  res.status(200).send(post);
};

const deletePost = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.postId;
  try {
    const data = await postModel.findById(id);
    await deleteFileFromPath(data?.picture);
    await commentModel.deleteMany({ post: id });
    await postModel.findByIdAndDelete(id);
    res.send("item deleted");
    return;
  } catch (err) {
    res.status(400).send(err);
    return;
  }
};

const likePost = async (req: Request, res: Response): Promise<void> => {
  const { postId } = req.params;
  const userId = req.query.userId as string;
  let flag = false;

  const post = await postModel.findById(postId);
  const user = await userModel.findById(userId);

  if (!user) {
    res.status(403).send("User not found");
    return;
  }

  if (!post) {
    res.status(404).send("Post not found");
    return;
  }

  const u_id = new Types.ObjectId(userId);
  const p_id = new Types.ObjectId(postId);

  if (post.likes.includes(u_id)) {
    // Unlike the post
    post.likes = post.likes.filter((id) => id.toString() !== userId);
    user.likedPosts = user.likedPosts.filter((id) => id.toString() !== postId);
    flag = true;
  } else {
    // Like the post
    post.likes.push(u_id);
    user.likedPosts.push(p_id);
  }

  await post.save();
  await user.save();

  if (flag) {
    res.send("Post unliked");
    return;
  } else {
    res.send("Post liked");
    return;
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
