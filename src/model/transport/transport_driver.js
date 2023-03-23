import mongoose from "mongoose";

const transportDriverSchema = mongoose.Schema({
  transportName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
});

const transportDriverModel = mongoose.model(
  "TransportDriver",
  transportDriverSchema
);

export default transportDriverModel;
