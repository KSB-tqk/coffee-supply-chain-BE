import express from "express";
import jwt from "jsonwebtoken";
import User from "../../model/user/user.js";
import userController from "../../controller/user/user_controller.js";
import auth from "../../middleware/authentication.js";

const userRouter = express.Router();

userRouter.post("/", userController.addUser);

userRouter.post("/login", userController.loginUser);

userRouter.get("/reset-password", userController.sendEmailOTPToChangePassword);

userRouter.get("/confirm-otp", userController.confirmEmailOTP);

userRouter.patch("/update-user", userController.updateUserInfoByEmail);

userRouter.get("/update-field-userid", userController.updateUserIdField);

userRouter.delete("/delete-user", userController.deleteUserByEmail);

userRouter.use(auth);

userRouter.post("/change-password", userController.confirmChangePassword);

userRouter.get("/permission", userController.getUserPermissionById);

userRouter.get("/", userController.getAllUserInfo);

userRouter.get("/me", userController.getCurrentUserInfo);

userRouter.get("/all-project", userController.getAllUserProject);

userRouter.get("/filter", userController.getAllUserByFilter);

userRouter.get("/all-notification", userController.getNotificationList);

userRouter.get("/department/:id", userController.getUserByDepartmentId);

userRouter.get("/role/:id", userController.getUserByRoleTypeId);

userRouter.get("/list/:page", userController.getListUserPaginate);

userRouter.patch("/permission", userController.updateUserPermission);

userRouter.patch("/me", userController.updateCurrentUserInfo);

userRouter.patch("/:id", userController.updateUserInfoById);

userRouter.post("/logout", userController.logoutCurrentUser);

userRouter.post("/logoutall", userController.logoutAllUser);

userRouter.delete("/me", userController.deleteCurrentUser);

userRouter.delete("/:id", userController.deleteUserById);

userRouter.get("/search-email", userController.getUserByEmail);

userRouter.get("/:id", userController.getUserById);

export default userRouter;
