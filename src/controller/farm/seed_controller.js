import mongoose from "mongoose";
import { checkValidObjectId, onError } from "../../helper/data_helper.js";
import { onValidSeedInfo } from "../../helper/farm/seed_data_helper.js";
import FarmModel from "../../model/farm/farm.js";
import SeedModel from "../../model/farm/seed.js";

const seedController = {
  addSeed: async (req, res) => {
    try {
      const { farmId } = req.body;

      if (!checkValidObjectId(farmId)) {
        return res.status(400).send(onError(400, "Invalid Farm Id"));
      }

      const farm = await FarmModel.findById(farmId);
      if (!farm)
        return res.status(400).send(onError(400, "This farm doesn't exist"));

      const isValidSeedInfo = await onValidSeedInfo(req.body);
      if (isValidSeedInfo != null)
        return res.status(400).send(onError(400, isValidSeedInfo));

      const newSeed = new SeedModel(req.body);
      newSeed.seedId = newSeed._id;
      await newSeed.save();

      await FarmModel.findByIdAndUpdate(farmId, {
        $push: {
          seeds: newSeed._id,
        },
      });

      res.status(200).send(newSeed);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateSeed: async (req, res) => {
    try {
      const { id } = req.params;
      const { seedName, seedFamily, supplier } = req.body;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Seed Id"));
      }
      const seed = await SeedModel.findById(id);

      if (!seed) {
        return res.status(400).send(onError(400, "This seed doesn't exist"));
      } else if (!seedName || !seedFamily || !supplier) {
        return res.status(400).send(onError(400, "Seed info can't be blank!"));
      }

      const newSeed = await SeedModel.findByIdAndUpdate(id, {
        $set: {
          seedName: seedName,
          seedFamily: seedFamily,
          supplier: supplier,
        },
      });
      res.status(200).send(newSeed);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  deleteSeed: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Seed Id"));
      }

      const seed = await SeedModel.findById(id);

      if (!seed)
        return res.status(400).send(onError(400, "This seed doesn't exist"));

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
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllSeeds: async (req, res) => {
    try {
      const seeds = await SeedModel.find().exec();
      res.status(200).send(seeds);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getSeed: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Seed Id"));
      }

      const seed = await SeedModel.findById(id).exec();

      if (!seed) {
        return res.status(400).send(onError(400, "This seed doesn't exist"));
      }

      res.status(200).send(seed);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllSeedsInFarm: async (req, res) => {
    try {
      const { farmId } = req.params;

      const validFarm = await FarmModel.findOne({ farmId: farmId });

      if (!validFarm) {
        res.status(400).send(onError(400), "This farm doesn't exist");
      }

      const seeds = await SeedModel.find({ farmId: farmId });

      return res.status(200).send(seeds);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

const SeedService = { seedController };

export default SeedService;
