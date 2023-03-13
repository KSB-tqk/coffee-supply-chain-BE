import mongoose from "mongoose";

const permissionSchema = mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listProject: [
      {
        projectId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Project",
          require: true,
        },
        access: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Access",
          require: true,
        },
      },
    ],
    listToken: [
      {
        token: {
          type: String,
          require: true,
          default: [],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const PermissionModel = mongoose.model("Permission", permissionSchema);

export default PermissionModel;
