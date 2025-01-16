import { Request, Response, NextFunction } from "express";
import commentModel from "../models/comment_model";
import postModel from "../models/post_model";

const createComment = async (req: Request, res: Response) => {
  const _id = req.query.userId;
  const comment = {
    user: _id,
    ...req.body,
  };
  req.body = comment;
  try {
    const data = await commentModel.create(req.body);
    const post = await postModel.findById(req.body.post);
    const commentId = data._id;
    if (post) {
      post.comments.push(commentId);
      await post.save();
    }
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getAllCommentsByPost = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = req.params.postId;
  try {
    const data = await commentModel.find({ post: id });
    if (data.length > 0) {
      res.status(200).send(data);
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

const getCommentById = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.commentId;
  try {
    const data = await commentModel.findById(id);
    if (data) {
      res.status(200).send(data);
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

const updateComment = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.commentId;
  const post = req.body.post;
  const user = req.body.user;
  if (post || user) {
    res.status(403).send("Cannot update postId or userId");
    return;
  }
  try {
    const data = await commentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (data) {
      res.status(200).send(data);
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

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.commentId;
  try {
    const comment = await commentModel.findById(id);
    if (comment) {
      const post = await postModel.findById(comment.post);
      if (post) {
        post.comments = post.comments.filter(
          (comment) => comment.toString() !== id
        );
        await post.save();
      }
    }
    const data = await commentModel.findByIdAndDelete(id);
    if (data) {
      res.status(200).send("item deleted");
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

export default {
  createComment,
  getAllCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
