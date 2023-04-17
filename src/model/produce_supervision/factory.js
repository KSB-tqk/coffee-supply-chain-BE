import mongoose from "mongoose";

const factorySchema = mongoose.Schema({
  factoryName: {
    type: String,
  },
  factoryPhoneNumber: {
    type: String,
  },
  factoryAddress: {
    type: String,
  },
  factoryId: {
    type: String,
  },
});

const FactoryModel = mongoose.model("Factory", factorySchema);

export default FactoryModel;
