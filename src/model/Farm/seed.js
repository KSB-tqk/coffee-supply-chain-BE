import mongoose from "mongoose";

const seedSchema = mongoose.Schema({
    seedName: {
        type: String,
        required: true,
        trim: true,
    },
    seedFamily: {
        type: String,
        required: true,
        trim: true,
    },
    supplier: {
        type: String,
        required: true,
        trim: true,
    },
    farmId: {
        type: String,
        required: true,
        trim: true,
    }
});

const SeedModel = mongoose.model('Seed', seedSchema);

export default SeedModel;