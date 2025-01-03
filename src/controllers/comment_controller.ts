import { Request, Response, NextFunction } from "express";
import commentModel from "../models/comment_model";

const createComment = async (req: Request, res: Response) => {
  const _id = req.query.userId;
  const comment = {
    user: _id,
    ...req.body,
  };
  req.body = comment;
  try {
    const data = await commentModel.create(req.body);
    res.status(201).send(data);
  } catch (err) {
    res.status(400).send(err);
  }
};

const getAllCommentsByPost = async (req: Request, res: Response) => {
  const id = req.params.postId;
  try {
    const data = await commentModel.find({ post: id });
    if (data.length > 0) {
      return res.status(200).send(data);
    } else {
      return res.status(404).send("item not found");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const getCommentById = async (req: Request, res: Response) => {
  const id = req.params.commentId;
  try {
    const data = await commentModel.findById(id);
    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(404).send("item not found");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const updateComment = async (req: Request, res: Response) => {
  const id = req.params.commentId;
  const post = req.body.post;
  const user = req.body.user;
  if (post || user) {
    return res.status(403).send("Cannot update postId or userId");
  }
  try {
    const data = await commentModel.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (data) {
      return res.status(200).send(data);
    } else {
      return res.status(404).send("item not found");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

const deleteComment = async (req: Request, res: Response) => {
  const id = req.params.commentId;
  try {
    const data = await commentModel.findByIdAndDelete(id);
    if (data) {
      return res.status(200).send("item deleted");
    } else {
      return res.status(404).send("item not found");
    }
  } catch (err) {
    return res.status(400).send(err);
  }
};

export default {
  createComment,
  getAllCommentsByPost,
  getCommentById,
  updateComment,
  deleteComment,
};
