import FarmModel from "../../model/Farm/farm.js";
import FarmProjectModel from "../../model/Farm/farm_project.js";
import LandModel from "../../model/Farm/land.js";
import SeedModel from "../../model/Farm/seed.js";
import { checkValidObjectId, onError } from "../../helper/data_helper.js";

const farmProjectController = {
  addFarmProject: async (req, res) => {
    try {
      const { farmId } = req.body;

      const farm = await FarmModel.findById(farmId);

      if (!farm)
        return res.status(400).send({ msg: "This farm doesn't exist" });

      const newFarmProject = new FarmProjectModel(req.body);
      newFarmProject.farmProjectId = newFarmProject._id;
      await newFarmProject.save();

      await FarmModel.findByIdAndUpdate(farmId, {
        $push: {
          farmProjects: newFarmProject._id,
        },
      });

      res.status(200).send(newFarmProject);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Farm Project Id" });
      }

      const {
        farmProjectName,
        land,
        seed,
        dateCreated,
        dateCompleted,
        totalHarvest,
        state,
      } = req.body;

      const farmProject = await FarmProjectModel.findById(id).exec();

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Land Id" });
      }
      const landProject = await LandModel.findById(land).exec();

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Seed Id" });
      }
      const seedProject = await SeedModel.findById(seed).exec();

      if (!farmProject)
        return res.status(400).send({ msg: "This farm project doesn't exist" });
      else if (!landProject)
        return res.status(400).send({ msg: "This land doesn't exist" });
      else if (!seedProject)
        return res.status(400).send({ msg: "This land doesn't exist" });
      else if (!farmProjectName || !dateCreated || !state) {
        return res.status(400).send({ msg: "Farm Prject Info can't be blank" });
      } else if (totalHarvest < 0) {
        return res
          .status(400)
          .send({ msg: "Total harvest must be greater than 0" });
      } else {
        await FarmProjectModel.findByIdAndUpdate(id, {
          $set: {
            farmProjectName: farmProjectName,
            land: land,
            seed: seed,
            dateCreated: dateCreated,
            dateCompleted: state === 3 ? Date.now() : dateCompleted,
            totalHarvest: totalHarvest,
            state: state,
          },
        });

        return res.status(200).send({ msg: "Update farm project success" });
      }
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  deleteFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id);

      if (!farmProject)
        return res.status(400).send({ msg: "This farm project doesn't exist" });

      await FarmModel.findByIdAndUpdate(farmProject.farmId, {
        $pull: {
          farmProjects: farmProject._id,
        },
      });

      await FarmProjectModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm project success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllFarmProjects: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProjects = await FarmProjectModel.find()
        .populate(["land", "seed"])
        .exec();
      res.status(200).send(farmProjects);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id)
        .populate(["land", "seed"])
        .exec();

      if (!farmProject)
        return res.status(400).send({ msg: "This farm project doesn't exist" });

      res.status(200).send(farmProject);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

const FarmProjectServices = { farmProjectController };

export default FarmProjectServices;
