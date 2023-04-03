import mongoose from "mongoose";

const stepLogSchema = mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    action: {
      type: String,
      default: "",
    },
    modelBeforeChanged: {
      type: String,
      default: null,
    },
    modelAfterChanged: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const StepLogModel = mongoose.model("StepLog", stepLogSchema);
export default StepLogModel;
