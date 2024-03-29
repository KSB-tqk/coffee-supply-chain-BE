import FarmModel from "../../model/farm/farm.js";
import FarmProjectModel from "../../model/farm/farm_project.js";
import LandModel from "../../model/farm/land.js";
import SeedModel from "../../model/farm/seed.js";
import {
  checkValidObjectId,
  getUserIdByHeader,
  onError,
  onResponse,
} from "../../helper/data_helper.js";
import { onValidFarmProjectInfo } from "../../helper/farm/farm_data_helper.js";
import User from "../../model/user/user.js";
import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserRole from "../../enum/user_role.js";
import StepLogModel from "../../model/step_log/step_log.js";
import ProjectModel from "../../model/project/project.js";
import { ObjectId } from "mongodb";

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

      if (farm.farmProjectList == null) farm.farmProjectList = [];
      farm.farmProjectList = farm.farmProjectList.concat({
        farmProject: newFarmProject._id,
      });
      farm.save();

      res.status(200).send(newFarmProject);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  updateFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Farm Project Id"));
      }

      const farmProject = await FarmProjectModel.findById(id).exec();

      if (req.body.land != null) {
        if (!checkValidObjectId(req.body.land)) {
          return res.status(400).send(onError(400, "Invalid Land Id"));
        }
        const landProject = await LandModel.findById(req.body.land);

        if (!landProject)
          return res.status(400).send(onError(400, "This land doesn't exist"));
      }

      if (req.body.seed != null) {
        if (!checkValidObjectId(req.body.seed)) {
          return res.status(400).send(onError(400, "Invalid Seed Id"));
        }
        const seedProject = await SeedModel.findById(req.body.seed);

        if (!seedProject)
          return res.status(400).send(onError(400, "This seed doesn't exist"));
      }

      if (!farmProject)
        return res
          .status(400)
          .send(onError(400, "This farm project doesn't exist"));
      else if (req.body.totalHarvest < 0 && req.body.totalHarvest != null) {
        return res
          .status(400)
          .send(onError(400, "Total harvest must be greater than 0"));
      } else {
        FarmProjectModel.findOne(
          { _id: farmProject._id },
          async function (err, farmProject) {
            if (err) {
              res
                .status(422)
                .send(onError(422, "Update harvest failed" + ERROR_MESSAGE));
            } else {
              // save to log to farm project
              let stepLog = StepLogModel();
              stepLog.projectId = farmProject.projectId;
              stepLog.actor = ObjectId(
                await getUserIdByHeader(req.header("Authorization"))
              );
              stepLog.modelBeforeChanged = JSON.stringify(farmProject);
              await stepLog.save();

              // push current stepLog into logList in harvest model
              if (farmProject.logList == null) farmProject.logList = [];
              farmProject.logList = farmProject.logList.concat({
                log: stepLog._id,
              });
              farmProject.logId = stepLog._id;

              // update model
              for (var field in FarmProjectModel.schema.paths) {
                if (field !== "_id" && field !== "__v") {
                  if (req.body[field] !== undefined) {
                    farmProject[field] = req.body[field];
                    console.log(
                      "farmProject update field: ",
                      farmProject[field]
                    );
                  }
                }
              }

              // save log for farmProject in project log list
              if (farmProject.projectId != null) {
                // save log to project log list
                const project = await ProjectModel.findById(
                  farmProject.projectId
                );
                if (!project)
                  return res
                    .status(404)
                    .send(
                      onError(
                        404,
                        "Project of this farm project was not found" +
                          ERROR_MESSAGE
                      )
                    );

                project.projectLogList = project.projectLogList.concat({
                  projectLog: stepLog._id,
                });

                await project.save();
              }

              // check to add farmer to farmPJ
              if (req.body.farmer != null) {
                if (!checkValidObjectId(req.body.farmer)) {
                  return res
                    .status(400)
                    .send(onError(400, "Invalid Farmer Id"));
                }
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
              }

              console.log("farmProject", farmProject);

              await farmProject.save();
              const farmProjectPop = await FarmProjectModel.findById(
                farmProject._id
              )
                .populate(["land", "seed"])
                .populate("farmer")
                .exec();
              res.status(200).send(farmProjectPop);

              console.log("farmProjectPop", farmProjectPop);

              // save the harvest model after changed
              // save the model after changed
              stepLog = await StepLogModel.findById(farmProjectPop.logId);
              stepLog.modelAfterChanged = JSON.stringify(farmProjectPop);
              console.log("Step Log Final", stepLog);
              stepLog.save();
            }
          }
        );
      }
    } catch (err) {
      res.status(500).send(onError(500, err.message));
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
      res.status(500).send(onError(500, err.message));
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
      res.status(500).send(onError(500, err.message));
    }
  },
  getAllNonFarmAssignFarmProject: async (req, res) => {
    try {
      const listFarmProject = await FarmProjectModel.find({ farmId: null });
      res.send(listFarmProject);
    } catch (e) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id)
        .populate(["land", "seed"])
        .populate("farmer")
        .exec();

      if (!farmProject)
        return res
          .status(400)
          .send(onError(400, "This farm project doesn't exist"));

      res.status(200).send(farmProject);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
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
      res.status(500).send(onError(500, err.message));
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

      res.status(200).send(farmProjectList.reverse());
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  getFarmProjectLogList: async (req, res) => {
    try {
      const farmProject = await FarmProjectModel.findById(
        req.query.farmProjectId
      )
        .populate({
          path: "logList",
          populate: {
            path: "log",
          },
        })
        .exec();
      if (farmProject.logList == null) farmProject.logList = [];

      res.status(200).send(farmProject.logList);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

const FarmProjectServices = { farmProjectController };

export default FarmProjectServices;
