import mongoose from "mongoose";
import SeedModel from "../../model/Farm/seed.js";
import LandModel from "../../model/Farm/land.js";
import FarmModel from "../../model/Farm/farm.js";


const seedController = {
    addSeed: async (req, res) => {
        try {
            const { farmId } = req.body;

            const farm = await FarmModel.findById(farmId);
            if(!farm) return res.status(400).json({ msg: "This farm doesn't exist" })

            const newSeed = new SeedModel(req.body);
            await newSeed.save();

            await FarmModel.findByIdAndUpdate(farmId, {
                $push: {
                     seeds: newSeed._id,
                } 
             });
 
            res.status(200).json({ msg: "Create land success" });


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

            const seed = await SeedModel.findById(id);

            if(!seed) {
                return res.status(400).json({ msg: "This seed doesn't exist" });
            }
            else if (!seedName || !seedFamily || !supplier) {
                return res.status(400).json({ msg: "Seed info can't be blank!" });
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
            const { id } = req.params;
            
            const seed = await SeedModel.findById(id);

            if(!seed) return res.status(400).json({ msg: "This seed doesn't exist" });

            console.log(seed._id);

            console.log(seed.farmId);

            await FarmModel.findByIdAndUpdate(seed.farmId, {
                $pull: {
                    seeds: seed._id,
                }
            });

            await SeedModel.findByIdAndRemove(id);
            res.status(200).json({ msg: 'Delete seed success' });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    getAllSeeds: async (req, res) => {
        try {
            const { id } = req.params;

            console.log(id);

            const seeds = await SeedModel.find({ farmId: id }).exec();
            res.status(200).json(seeds);
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    getSeed: async (req, res) => {
        try {
            const {id} = req.params;

            const seed = await SeedModel.findById(id).exec();

            if(!seed) {
                return res.status(400).json({ msg: "This seed doesn't exist" });
            }
            
            res.status(200).json(seed);

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    }
};

const landController = {
    addLand: async (req, res) => {
        try {
            
            const { farmId } = req.body;

            const farm = await FarmModel.findById(farmId);

            if(!farm) {
                return res.status(400).json({ msg: "This farm doesn't exist" });
            }

            const newLand = new LandModel(req.body);
            await newLand.save();

            await FarmModel.findByIdAndUpdate(farmId, {
               $push: {
                    lands: newLand._id,
               } 
            });

            res.status(200).json({ msg: "Create land success" });

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    updateLand: async (req, res) => {
        try {
            const { id } = req.params;
            const { landName, landArea, state } = req.body;

            const landId = await LandModel.findById(id);

            if(!landId) return res.status(400).json({ msg: "This land doesn't exist"});

            else if (!landName || !landArea || !state) {
                return res.status(400).json({ msg: "Seed name can't be blank!" });
            }
            await LandModel.findByIdAndUpdate(id, {
                $set: {
                    landName: landName,
                    landArea: landArea,
                    state: state,
                },
            });
            res.status(200).json({ msg: `Update seed success` });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    deleteLand: async (req, res) => {
        try {
            const { id } = req.params;
            
            const land = await LandModel.findById(id);

            if(!land) return res.status(400).json({ msg: "This land doesn't exist" });


            await FarmModel.findByIdAndUpdate(land.farmId, {
                $pull: {
                    lands: land._id,
                }
            });

            await LandModel.findByIdAndRemove(id);
            res.status(200).json({ msg: 'Delete land success' });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    getAllLands: async (req, res) => {
        try {
            const { id } = req.params;

            console.log(id);

            const lands = await LandModel.find({ farmId: id }).exec();
            res.status(200).json(lands);
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    getLand: async (req, res) => {
        try {
            const {id} = req.params;

            const land = await LandModel.findById(id).exec();

            if(!land) {
                return res.status(400).json({ msg: "This land doesn't exist" });
            }
            
            res.status(200).json(land);

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    }
};

const farmController = {
    addFarm: async (req, res) => {
        try {
            const newFarm = new FarmModel(req.body);
            await newFarm.save();

            res.status(200).json({ msg: "Create farm success" });

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    updateFarm: async (req, res) => {
        try {
            const {id} = req.params;
            const {
                farmName,
                farmAddress,
                farmPhoneNumber,
            } = req.body;

            const farm = await FarmModel.findById(id).exec();

            if(!farm) return res.status(400).json({ msg: "This farm doesn't exist" });

            else if (!farmName || !farmAddress || !farmPhoneNumber) {
                return res.status(400).json({ msg: "Farm info can't be blank!" });
            }

            await FarmModel.findByIdAndUpdate(id, {
                $set: {
                    farmName: farmName,
                    farmAddress: farmAddress,
                    farmPhoneNumber: farmPhoneNumber,
                },
            });
            res.status(200).json({ msg: `Update seed success` });

        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    getFarm: async (req, res) => {
        try {
            const {id} = req.params;

            const farm = await FarmModel.findOne({ farmOwner: id }).populate(["farmOwner", "seeds", "lands", "farmProjects"]).exec();

            if(!farm) return res.status(400).json({ msg: "No exist farm" });

            res.status(200).json(farm);

        } catch (err) {
            res.status(400).json({ msg: err.msg });
        }
    },
    getAllFarms: async (req, res) => {
        try {
            const farms = await FarmModel.find().populate(["farmOwner", "seeds", "lands", "farmProjects"]).exec();

            res.status(200).json(farms);
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    }
};

const FarmServices = { seedController, landController, farmController };

export default FarmServices;