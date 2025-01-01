import express, { Request, Response, NextFunction } from "express";
import postController from "../controllers/post_controller";
import { authUser } from "../middleware/auth_middleware";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  postController.getAllPosts(req, res);
});

router.get("/:postId", (req: Request, res: Response) => {
  postController.getPostById(req, res);
});

router.post("/", authUser, (req: Request, res: Response) => {
  postController.createPost(req, res);
});

router.post("/:postId/like", authUser, (req: Request, res: Response) => {
    postController.likePost(req, res);
  });

router.put("/:postId", authUser, (req: Request, res: Response) => {
  postController.updatePost(req, res);
});

router.delete("/:postId", authUser, (req: Request, res: Response) => {
  postController.deletePost(req, res);
});

export default router;
