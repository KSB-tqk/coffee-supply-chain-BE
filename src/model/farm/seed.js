import mongoose from "mongoose";

const seedSchema = mongoose.Schema({
  seedId: {
    type: String,
    required: true,
    default: null,
  },
  farmId: {
    type: String,
    required: true,
    trim: true,
    default: null,
  },
  seedName: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  seedFamily: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
  supplier: {
    type: String,
    required: true,
    trim: true,
    default: "",
  },
});

const SeedModel = mongoose.model("Seed", seedSchema);

export default SeedModel;
