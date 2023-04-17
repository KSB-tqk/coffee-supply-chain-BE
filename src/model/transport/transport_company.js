import mongoose from "mongoose";

const transportCompanySchema = mongoose.Schema({
  transportName: {
    type: String,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  transportCompanyId: {
    type: String,
  },
});

const transportCompanyModel = mongoose.model(
  "TransportCompany",
  transportCompanySchema
);

export default transportCompanyModel;
