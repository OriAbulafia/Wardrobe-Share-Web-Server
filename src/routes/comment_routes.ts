import express, { Request, Response, NextFunction } from "express";
import commentController from "../controllers/comment_controller";
import { authUser } from "../middleware/auth_middleware";

const router = express.Router();


router.post("/", authUser, commentController.createComment);

router.get("/post/:postId", commentController.getAllCommentsByPost);

router.get("/:commentId", commentController.getCommentById);

router.put("/:commentId", authUser, commentController.updateComment);

router.delete("/:commentId", authUser, commentController.deleteComment);

export default router;
