import mongoose from "mongoose";

const landSchema = mongoose.Schema({
  landId: {
    type: String,
    trim: true,
    default: null,
  },
  farmId: {
    type: String,
    trim: true,
    default: null,
  },
  landName: {
    type: String,
    trim: true,
    default: "",
  },
  landArea: {
    type: Number,
    trim: true,
  },
  state: {
    type: Number,
    required: true,
    default: 1,
  },
});

const LandModel = mongoose.model("Land", landSchema);

export default LandModel;
