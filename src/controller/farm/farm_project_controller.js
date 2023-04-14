import FarmModel from "../../model/farm/farm.js";
import FarmProjectModel from "../../model/farm/farm_project.js";
import LandModel from "../../model/farm/land.js";
import SeedModel from "../../model/farm/seed.js";
import {
  checkValidObjectId,
  onError,
  onResponse,
} from "../../helper/data_helper.js";
import { onValidFarmProjectInfo } from "../../helper/farm/farm_data_helper.js";
import User from "../../model/user/user.js";
import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserRole from "../../enum/user_role.js";

const farmProjectController = {
  addFarmProject: async (req, res) => {
    try {
      const farmId = req.body.farmId;

      const farm = await FarmModel.findById(farmId);

      if (!farm)
        return res
          .status(400)
          .send(onResponse(true, "This farm doesn't exist"));

      const isValidFarmProjectInfo = await onValidFarmProjectInfo(req.body);

      if (isValidFarmProjectInfo != null)
        return res.status(400).send(onResponse(true, isValidFarmProjectInfo));

      const newFarmProject = new FarmProjectModel(req.body);
      newFarmProject.farmProjectId = newFarmProject._id;
      await newFarmProject.save();

      if (farm.farmProjectList == null) farm.farmProjectList = [];
      farm.farmProjectList = farm.farmProjectList.concat({
        farmProject: newFarmProject._id,
      });
      farm.save();

      res.status(200).send(newFarmProject);
    } catch (err) {
      res.status(400).send(onResponse(true, err.message));
    }
  },
  updateFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res
          .status(400)
          .send(onResponse(true, "Invalid Farm Project Id"));
      }

      const {
        farmProjectName,
        land,
        seed,
        dateCreated,
        dateCompleted,
        totalHarvest,
        state,
        farmer,
      } = req.body;

      const farmProject = await FarmProjectModel.findById(id).exec();

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onResponse(true, "Invalid Land Id"));
      }
      const landProject = await LandModel.findById(land).exec();

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onResponse(true, "Invalid Seed Id"));
      }
      const seedProject = await SeedModel.findById(seed).exec();

      if (!farmProject)
        return res
          .status(400)
          .send(onResponse(true, "This farm project doesn't exist"));
      else if (!landProject)
        return res
          .status(400)
          .send(onResponse(true, "This land doesn't exist"));
      else if (!seedProject)
        return res
          .status(400)
          .send(onResponse(true, "This seed doesn't exist"));
      else if (!farmProjectName || !state) {
        return res
          .status(400)
          .send(onResponse(true, "Farm Prject Info can't be blank"));
      } else if (totalHarvest < 0) {
        return res
          .status(400)
          .send(onResponse(true, "Total harvest must be greater than 0"));
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

        // check to add farmer to farmPJ
        if (req.body.farmer != null) {
          const farmer = await User.findById(req.body.farmer);
          if (farmer == null)
            return res
              .status(400)
              .send(onError(400, "Farmer Not Found" + ERROR_MESSAGE));
          if (farmer.role != UserRole.Farmer)
            return res
              .status(400)
              .send(onError(400, "User is not a farmer" + ERROR_MESSAGE));
          farmProject.farmer = farmer._id;
          await farmProject.save();
        }

        return res.status(200).send(farmProject);
      }
    } catch (err) {
      res.status(400).send(onResponse(true, err.message));
    }
  },
  deleteFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id);

      if (!farmProject)
        return res
          .status(400)
          .send(onResponse(true, "This farm project doesn't exist"));

      await FarmModel.findByIdAndUpdate(farmProject.farmId, {
        $pull: {
          farmProjects: farmProject._id,
        },
      });

      await FarmProjectModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm project success" });
    } catch (err) {
      res.status(400).send(onResponse(true, err.message));
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
      res.status(400).send(onResponse(true, err.message));
    }
  },
  getAllNonFarmAssignFarmProject: async (req, res) => {
    try {
      const listFarmProject = await FarmProjectModel.find({ farmId: null });
      res.send(listFarmProject);
    } catch (e) {
      res.status(400).send(onResponse(true, err.message));
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
          .send(onResponse(true, "This farm project doesn't exist"));

      res.status(200).send(farmProject);
    } catch (err) {
      res.status(400).send(onResponse(true, err.message));
    }
  },
  getAllFarmProjectsInFarm: async (req, res) => {
    try {
      const { farmId } = req.params;

      const validFarm = await FarmModel.findOne({ farmId: farmId });

      if (!validFarm) {
        res.status(400).send(onError(400), "This farm doesn't exist");
      }

      const farmProjects = await FarmProjectModel.find({ farmId: farmId })
        .populate(["land", "seed", "farmer", "projectId"])
        .exec();
      res.status(200).send(farmProjects);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllFarnProjectByUserId: async (req, res) => {
    try {
      const user = await User.findById(req.query.userId);
      if (!user)
        return res
          .status(404)
          .send(onError(404, "User Not Found" + ERROR_MESSAGE));

      const farmProjectList = await FarmProjectModel.find({
        farmer: user._id,
      }).populate(["land", "seed"]);
      if (farmProjectList == null)
        return res
          .status(404)
          .send(
            onError(
              404,
              "No farm project was found contain this farmer" + ERROR_MESSAGE
            )
          );

      res.status(200).send(farmProjectList);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

const FarmProjectServices = { farmProjectController };

export default FarmProjectServices;
