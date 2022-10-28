import mongoose from "mongoose";

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
    farmNumberPhone: {
        type: String,
        trim: true,
        required: true,
    },
    farmOwner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
});

const FarmModel = mongoose.model('Farm', farmSchema);

export default FarmModel;