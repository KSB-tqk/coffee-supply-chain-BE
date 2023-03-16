import mongoose from "mongoose";

const landSchema = mongoose.Schema({
  landId: {
    type: String,
    trim: true,
    default: null,
  },
  farmId: {
    type: String,
    required: true,
    trim: true,
    default: null,
  },
  landName: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  landArea: {
    type: Number,
    required: true,
    trim: true,
    default: 0,
  },
  state: {
    type: Number,
    required: true,
    default: 1,
  },
});

const LandModel = mongoose.model("Land", landSchema);

export default LandModel;
