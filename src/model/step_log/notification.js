import mongoose from "mongoose";

const notificationSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    message: {
      type: String,
    },
    title: {
      type: String,
    },
    stepLogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StepLog",
    },
  },
  {
    timestamps: true,
  }
);

const NotificationModel = mongoose.model("Notification", notificationSchema);
export default NotificationModel;
