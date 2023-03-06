import mongoose from "mongoose";

const accessSchema = mongoose.Schema({
  listAccess: [
    {
      accessItem: {
        type: Number,
      },
    },
  ],
});

const AccessModel = mongoose.model("Access", accessSchema);

export default AccessModel;
