import express from "express";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";
import userController from "../../controller/user/user_controller.js";
import auth from "../../middleware/authentication.js";

const userRouter = express.Router();

userRouter.post("/", userController.addUser);

userRouter.post("/login", userController.loginUser);

userRouter.use(auth);

userRouter.get("/", userController.getAllUserInfo);

userRouter.get("/me", userController.getCurrentUserInfo);

userRouter.get("/:id", userController.getUserById);

userRouter.get("/department/:id", userController.getUserByDepartmentId);

userRouter.get("/role/:id", userController.getUserByRoleTypeId);

userRouter.get("/list/:page", userController.getListUserPaginate);

userRouter.patch("/me", userController.updateCurrentUserInfo);

userRouter.patch("/:id", userController.updateUserInfoById);

userRouter.post("/logout", userController.logoutCurrentUser);

userRouter.post("/logoutall", userController.logoutAllUser);

userRouter.delete("/me", userController.deleteCurrentUser);

userRouter.delete("/:id", userController.deleteUserById);

export default userRouter;
