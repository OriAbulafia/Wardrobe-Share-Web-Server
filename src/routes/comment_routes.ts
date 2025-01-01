import express, { Request, Response, NextFunction } from "express";
import commentController from "../controllers/comment_controller";
import { authUser } from "../middleware/auth_middleware";

const router = express.Router();


router.post("/", authUser, (req: Request, res: Response) => {
    commentController.createComment(req, res);
});

router.get("/post/:postId", (req: Request, res: Response) => {
    commentController.getAllCommentsByPost(req, res);
});

router.get("/:commentId", (req: Request, res: Response) => {
    commentController.getCommentById(req, res);
});

router.put("/:commentId", authUser, (req: Request, res: Response) => {
    commentController.updateComment(req, res);
});

router.delete("/:commentId", authUser, (req: Request, res: Response) => {
    commentController.deleteComment(req, res);
});

export default router;
