import mongoose from "mongoose";
import SeedModel from "../model/seed.js";


const seedController = {
    addSeed: async (req, res) => {
        console.log(req.body);
        try {
            const newSeed = new SeedModel(req.body);
            await newSeed.save();

            res.status(200).json({ msg: "Create seed success" });

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    updateSeed: async (req, res) => {
        try {
            const { id } = req.params;
            const {
                seedName,
                seedFamily,
                supplier,
            } = req.body;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: `No seed with id: ${id}` });
            }
            else if (!seedName) {
                return res.status(400).json({ msg: "Seed name can't be blank!" });
            }

            await SeedModel.findByIdAndUpdate(id, {
                $set: {
                    seedName: seedName,
                    seedFamily: seedFamily,
                    supplier: supplier,
                },
            });
            res.status(200).json({ msg: `Update seed success` });

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    deleteSeed: async (req, res) => {
        try {
            const {id} = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ msg: `No seed with id: ${id}` });
            }

            await SeedModel.findByIdAndRemove(id);
            res.status(200).json({ msg: 'Delete seed success' });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
};

const FarmServices = { seedController };

export default FarmServices;