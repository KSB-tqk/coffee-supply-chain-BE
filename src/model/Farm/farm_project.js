import mongoose from "mongoose";

const farmProjectSchema = mongoose.Schema({
    farmId: {
        type: String,
        required: true,
        trim: true,
    },
    farmProjectName: {
        type: String,
        required: true,
        trim: true,
    },
    enterprise: {
        type: String,
        required: true,
        default: "HK Solution - Tracebility",
        trim: true,
    },
    land: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Land',
    },
    seed: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Seed',
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now,
    },
    dateCompleted: {
        type: Date,
        required: false,
    },
    totalHarvest: {
        type: Number,
        required: true,
        default: 0,
    },
    state: {
        type: Number,
        required: true,
        default: 1,
    },
});

const FarmProjectModel = mongoose.model('FarmProject', farmProjectSchema);

export default FarmProjectModel;