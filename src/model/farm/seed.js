import mongoose from "mongoose";

const seedSchema = mongoose.Schema({
  seedId: {
    type: String,
    required: true,
    default: null,
  },
  farmId: {
    type: String,
    trim: true,
    default: null,
  },
  seedName: {
    type: String,
    trim: true,
    default: "",
  },
  seedFamily: {
    type: String,
    trim: true,
    default: "",
  },
  supplier: {
    type: String,
    trim: true,
    default: "",
  },
});

const SeedModel = mongoose.model("Seed", seedSchema);

export default SeedModel;
