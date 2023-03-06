import mongoose from "mongoose";

const permissionSchema = mongoose.Schema({
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
});

const PermissionModel = mongoose.model("Permission", permissionSchema);

export default PermissionModel;
