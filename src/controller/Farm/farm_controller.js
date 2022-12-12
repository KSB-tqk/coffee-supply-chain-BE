import mongoose from "mongoose";
import SeedModel from "../../model/Farm/seed.js";
import LandModel from "../../model/Farm/land.js";
import FarmModel from "../../model/Farm/farm.js";
import User from "../../model/user/user.js";
import { checkValidObjectId } from "../../helper/data_helper.js";

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

// Land Controller //

const landController = {
  addLand: async (req, res) => {
    try {
      const { farmId } = req.body;

      if (!checkValidObjectId(farmId)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(farmId);

      if (!farm) {
        return res.status(400).send({ msg: "This farm doesn't exist" });
      }

      const newLand = new LandModel(req.body);
      await newLand.save();

      await FarmModel.findByIdAndUpdate(farmId, {
        $push: {
          lands: newLand._id,
        },
      });

      res.status(200).send({ msg: "Create land success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateLand: async (req, res) => {
    try {
      const { id } = req.params;
      const { landName, landArea, state } = req.body;

      if (!checkValidObjectId(id)) {
        res.status(400).send({ error: "Invalid Land Id" });
      }

      const landId = await LandModel.findById(id);

      if (!landId)
        return res.status(400).send({ msg: "This land doesn't exist" });
      else if (!landName || !landArea || !state) {
        return res.status(400).send({ msg: "Seed name can't be blank!" });
      }
      await LandModel.findByIdAndUpdate(id, {
        $set: {
          landName: landName,
          landArea: landArea,
          state: state,
        },
      });
      res.status(200).send({ msg: `Update seed success` });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  deleteLand: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Land Id" });
      }

      const land = await LandModel.findById(id);

      if (!land)
        return res.status(400).send({ msg: "This land doesn't exist" });

      await FarmModel.findByIdAndUpdate(land.farmId, {
        $pull: {
          lands: land._id,
        },
      });

      await LandModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete land success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllLands: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const lands = await LandModel.find({ farmId: id }).exec();
      res.status(200).send(lands);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getLand: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Land Id" });
      }

      const land = await LandModel.findById(id).exec();

      if (!land) {
        return res.status(400).send({ msg: "This land doesn't exist" });
      }

      res.status(200).send(land);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

// Farm Controller

const farmController = {
  addFarm: async (req, res) => {
    try {
      const newFarm = new FarmModel(req.body);
      await newFarm.save();

      res.status(200).send({ msg: "Create farm success", farm: newFarm });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateFarm: async (req, res) => {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = ["farmName", "farmAddress", "farmPhoneNumber"];

      if (!checkValidObjectId(req.body.farmOwner)) {
        res.status(400).send({ error: "Invalid User Id" });
      }

      const user = await User.findById(req.body.farmOwner);

      if (!user || checkValidObjectId(req.body.farmOwner)) {
        return res.status(404).send({
          error: "User Not Found, Please add user to the farm before updating",
        });
      }

      if (user.role == 1) {
        allowedUpdates.push("farmOwner");
      }

      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(req.params.id);

      if (!farm)
        return res.status(400).send({ msg: "This farm doesn't exist" });
      else if (!farm.farmName || !farm.farmAddress || !farm.farmPhoneNumber) {
        return res.status(400).send({ msg: "Farm info can't be blank!" });
      }

      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates" });
      }

      updates.forEach((update) => {
        farm[update] = req.body[update];
      });

      await farm.save();
      if (!farm) {
        return res.status(400).send(e.toString());
      } else {
        return res
          .status(200)
          .send({ msg: `Update farm success`, farmId: farm._id });
      }
    } catch (err) {
      res.status(400).send({ msg: err.toString() });
    }
  },
  getFarm: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(id).exec();

      if (!farm) return res.status(400).send({ msg: "No exist farm" });

      res.status(200).send(farm);
    } catch (err) {
      res.status(400).send({ msg: err.msg });
    }
  },
  getAllFarms: async (req, res) => {
    try {
      const farms = await FarmModel.find().exec();

      res.status(200).send(farms);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  deleteFarms: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(id);

      if (!farm)
        return res.status(400).send({ msg: "This farm doesn't exist" });

      await FarmModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm success", farmId: farm._id });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

const FarmServices = { seedController, landController, farmController };

export default FarmServices;
