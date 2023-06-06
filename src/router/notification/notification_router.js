import express from "express";
import auth from "../../middleware/authentication.js";
import notificationController from "../../controller/notification/notification_controller.js";

const notificationRouter = express.Router();

notificationRouter.use(auth);

notificationRouter.post(
  "/push-noti",
  notificationController.pushNotificationSingleUser
);

notificationRouter.post(
  "/subscribe-topic",
  notificationController.subscribeToTopic
);

notificationRouter.post(
  "/unsubscribe-topic",
  notificationController.unSubscribeToTopic
);

notificationRouter.post(
  "/push-noti-topic",
  notificationController.pushNotificationToTopic
);

notificationRouter.post(
  "/save-fcm-token",
  notificationController.saveUserFCMToken
);

notificationRouter.get("/by-id", notificationController.getNotificationLogById);
export default notificationRouter;
