import express, { Request, Response } from "express";
import userController from "../controllers/user_controller";
import { authUser } from "../middleware/auth_middleware";
import upload from "../config/storage";

const router = express.Router();

router.post("/register", upload.single("picture"), userController.register);

router.post("/googleLogin", userController.googleLogin);

router.post("/login", userController.login);

router.post("/logout", userController.logout);

router.post("/refresh", userController.refresh);

router.get("/:userId", userController.getUser);

router.get("/auth/settings", authUser, userController.getSettings);

router.put(
  "/update",
  authUser,
  upload.single("picture"),
  userController.updateUser
);

router.delete("/delete", authUser, userController.deleteUser);

export default router;
