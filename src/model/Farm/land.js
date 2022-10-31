import mongoose from "mongoose";

const landSchema = mongoose.Schema({
    landName: {
        type: String,
        required: true,
        trim: true,
    },
    landArea: {
        type: Number,
        required: true,
        trim: true,
    },
    farmId: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: Number,
        required: true,
        default: 1,
    },
});

const LandModel = mongoose.model('Land', landSchema);

export default LandModel;