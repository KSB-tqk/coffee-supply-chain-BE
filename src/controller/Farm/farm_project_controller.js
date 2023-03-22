import FarmModel from "../../model/farm/farm.js";
import FarmProjectModel from "../../model/farm/farm_project.js";
import LandModel from "../../model/farm/land.js";
import SeedModel from "../../model/farm/seed.js";
import { checkValidObjectId, onError } from "../../helper/data_helper.js";
import { onValidFarmProjectInfo } from "../../helper/farm/farm_data_helper.js";

const farmProjectController = {
  addFarmProject: async (req, res) => {
    try {
      const farmId = req.body.farmId;

      const farm = await FarmModel.findById(farmId);

      if (!farm)
        return res.status(400).send(onError(400, "This farm doesn't exist"));

      const isValidFarmProjectInfo = await onValidFarmProjectInfo(req.body);

      if (isValidFarmProjectInfo != null)
        return res.status(400).send(onError(400, isValidFarmProjectInfo));

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
        return res.status(400).send(onError(400, "Invalid Farm Project Id"));
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
        return res.status(400).send(onError(400, "Invalid Land Id"));
      }
      const landProject = await LandModel.findById(land).exec();

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Seed Id"));
      }
      const seedProject = await SeedModel.findById(seed).exec();

      if (!farmProject)
        return res
          .status(400)
          .send(onError(400, "This farm project doesn't exist"));
      else if (!landProject)
        return res.status(400).send(onError(400, "This land doesn't exist"));
      else if (!seedProject)
        return res.status(400).send(onError(400, "This seed doesn't exist"));
      else if (!farmProjectName || !state) {
        return res
          .status(400)
          .send(onError(400, "Farm Prject Info can't be blank"));
      } else if (totalHarvest < 0) {
        return res
          .status(400)
          .send(onError(400, "Total harvest must be greater than 0"));
      } else {
        const farmProject = await FarmProjectModel.findByIdAndUpdate(id, {
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

        return res.status(200).send(farmProject);
      }
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  deleteFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id);

      if (!farmProject)
        return res
          .status(400)
          .send(onError(400, "This farm project doesn't exist"));

      await FarmModel.findByIdAndUpdate(farmProject.farmId, {
        $pull: {
          farmProjects: farmProject._id,
        },
      });

      await FarmProjectModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm project success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
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
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllNonFarmAssignFarmProject: async (req, res) => {
    try {
      const listFarmProject = await FarmProjectModel.find({ farmId: null });
      res.send(listFarmProject);
    } catch (e) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id)
        .populate(["land", "seed"])
        .exec();

      if (!farmProject)
        return res
          .status(400)
          .send(onError(400, "This farm project doesn't exist"));

      res.status(200).send(farmProject);
    } catch (err) {
      res.status(400).send(onError(400, err.toString()));
    }
  },
};

const FarmProjectServices = { farmProjectController };

export default FarmProjectServices;
