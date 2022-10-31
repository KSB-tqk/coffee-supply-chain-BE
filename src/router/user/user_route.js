import express from "express";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";
import userController from "../../controller/user/user_controller.js";
import auth from "../../middleware/authentication.js";

const userRouter = express.Router();

userRouter.post("/", userController.addUser);

userRouter.post("/login", userController.loginUser);

userRouter.get("/", auth, userController.getAllUserInfo);

userRouter.get("/me", auth, userController.getCurrentUserInfo);

userRouter.get("/:id", auth, userController.getUserById);

userRouter.patch("/me", auth, userController.updateCurrentUserInfo);

userRouter.post("/logout", auth, userController.logoutCurrentUser);

userRouter.post("/logoutall", auth, userController.logoutAllUser);

userRouter.delete("/me", auth, userController.deleteCurrentUser);

export default userRouter;
