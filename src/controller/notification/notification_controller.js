import { ERROR_MESSAGE } from "../../enum/app_const.js";
import { onError } from "../../helper/data_helper.js";
import {
  pushNotification,
  pushNotificationToTopic,
  subscribeToTopic,
  unSubscribeFromTopic,
} from "../../helper/firebase/fcm_helper.js";
import User from "../../model/user/user.js";

const notificationController = {
  pushNotificationSingleUser: async (req, res) => {
    try {
      const response = await pushNotification(
        req.body.registrationToken,
        req.body.title,
        req.body.message
      );
      if (response != null) res.send({ data: response });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  subscribeToTopic: async (req, res) => {
    try {
      const response = await subscribeToTopic(
        req.body.topic,
        req.body.registrationToken
      );
      if (response != null) res.send({ data: response });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  unSubscribeToTopic: async (req, res) => {
    try {
      const response = await unSubscribeFromTopic(
        req.body.topic,
        req.body.registrationToken
      );
      if (response != null) res.send({ data: response });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  pushNotificationToTopic: async (req, res) => {
    try {
      const response = await pushNotificationToTopic(
        req.body.topic,
        req.body.title,
        req.body.message,
        req.body.userId
      );
      if (response != null) res.send({ data: response });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  saveUserFCMToken: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user == null)
        return res
          .status(400)
          .send(onError(400, "User not found" + ERROR_MESSAGE));

      user.fcmToken = req.body.token;
      await user.save();
      res.send(user);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

export default notificationController;
