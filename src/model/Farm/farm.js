import mongoose, { mongo } from "mongoose";

const farmSchema = mongoose.Schema({
    farmName: {
        type: String,
        trim: true,
        required: true,
    },
    farmAddress: {
        type: String,
        trim: true,
        required: true,
    },
    farmPhoneNumber: {
        type: String,
        trim: true,
        required: true,
    },
    farmOwner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    seeds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Seed',
    }],
    lands: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Land'
    }],
    farmProjects: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FarmProject',
    }]
});

const FarmModel = mongoose.model('Farm', farmSchema);

export default FarmModel;