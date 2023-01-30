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
        require: true,
      },
      listPermission: [
        {
          permissionId: {
            type: Number,
          },
        },
      ],
    },
  ],
});

const PermissionModel = mongoose.model("Permission", permissionSchema);

export default PermissionModel;
