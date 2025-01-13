import express, { Request, Response, NextFunction } from "express";
import postController from "../controllers/post_controller";
import { authUser } from "../middleware/auth_middleware";
import upload from "../config/storage";

const router = express.Router();

router.get("/", postController.getAllPosts);

router.get("/:postId", postController.getPostById);

router.post("/", authUser, upload.single("picture"), postController.createPost);

router.post("/:postId/like", authUser, postController.likePost);

router.put(
  "/:postId",
  authUser,
  upload.single("picture"),
  postController.updatePost
);

router.delete("/:postId", authUser, postController.deletePost);

export default router;
