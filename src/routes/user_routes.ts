import express, { Request, Response } from "express";
import userController from "../controllers/user_controller";
import { authUser } from "../middleware/auth_middleware";

const router = express.Router();

router.post("/register", userController.register);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.post("/refresh", userController.refresh);

router.get("/:id", authUser, (req: Request, res: Response) => {
    userController.getUser(req, res);
});

router.put("/update", authUser, (req: Request, res: Response) => {
    userController.updateUser(req, res);
});

router.delete("/delete", authUser, (req: Request, res: Response) => {
    userController.deleteUser(req, res);
});

export default router;