import mongoose from "mongoose"

const mongooseDB = mongoose.connect(process.env.MONGODB_URL);

export default mongooseDB;
