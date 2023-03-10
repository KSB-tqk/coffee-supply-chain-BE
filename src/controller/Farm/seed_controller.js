import mongoose from "mongoose";
import SeedModel from "../../model/Farm/seed.js";

const seedController = {
    addSeed: async (req, res) => {
      try {
        const { farmId } = req.body;
  
        if (!checkValidObjectId(farmId)) {
          return res.status(400).send({ error: "Invalid Farm Id" });
        }
  
        const farm = await FarmModel.findById(farmId);
        if (!farm)
          return res.status(400).send({ msg: "This farm doesn't exist" });
  
        const newSeed = new SeedModel(req.body);
        await newSeed.save();
  
        await FarmModel.findByIdAndUpdate(farmId, {
          $push: {
            seeds: newSeed._id,
          },
        });
  
        res.status(200).send({ msg: "Create land success" });
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    updateSeed: async (req, res) => {
      try {
        const { id } = req.params;
        const { seedName, seedFamily, supplier } = req.body;
  
        if (!checkValidObjectId(id)) {
          return res.status(400).send({ error: "Invalid Seed Id" });
        }
        const seed = await SeedModel.findById(id);
  
        if (!seed) {
          return res.status(400).send({ msg: "This seed doesn't exist" });
        } else if (!seedName || !seedFamily || !supplier) {
          return res.status(400).send({ msg: "Seed info can't be blank!" });
        }
  
        await SeedModel.findByIdAndUpdate(id, {
          $set: {
            seedName: seedName,
            seedFamily: seedFamily,
            supplier: supplier,
          },
        });
        res.status(200).send({ msg: `Update seed success` });
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    deleteSeed: async (req, res) => {
      try {
        const { id } = req.params;
  
        if (!checkValidObjectId(id)) {
          return res.status(400).send({ error: "Invalid Seed Id" });
        }
  
        const seed = await SeedModel.findById(id);
  
        if (!seed)
          return res.status(400).send({ msg: "This seed doesn't exist" });
  
        console.log(seed._id);
  
        console.log(seed.farmId);
  
        await FarmModel.findByIdAndUpdate(seed.farmId, {
          $pull: {
            seeds: seed._id,
          },
        });
  
        await SeedModel.findByIdAndRemove(id);
        res.status(200).send({ msg: "Delete seed success" });
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    getAllSeeds: async (req, res) => {
      try {
        const { id } = req.params;
  
        console.log(id);
  
        const seeds = await SeedModel.find({ farmId: id }).exec();
        res.status(200).send(seeds);
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    getSeed: async (req, res) => {
      try {
        const { id } = req.params;
  
        if (!checkValidObjectId(id)) {
          return res.status(400).send({ error: "Invalid Seed Id" });
        }
  
        const seed = await SeedModel.findById(id).exec();
  
        if (!seed) {
          return res.status(400).send({ msg: "This seed doesn't exist" });
        }
  
        res.status(200).send(seed);
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
};

const SeedService = { seedController };

export default SeedService;