import mongoose from "mongoose";

const transportSchema = mongoose.Schema({
  transportName: {
    type: String,
    required: true,
  },
  transportPhoneNumber: {
    type: String,
  },
  transportAddress: {
    type: String,
  },
});

const transportModel = mongoose.model("Transport", transportSchema);

export default transportModel;
