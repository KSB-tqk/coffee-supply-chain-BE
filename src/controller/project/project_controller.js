import { ObjectId } from "mongodb";
import {
  ERROR_MESSAGE,
  getStepLogId,
  setStepLogId,
} from "../../enum/app_const.js";
import UserRole from "../../enum/user_role.js";
import {
  checkValidObjectId,
  getUserIdByHeader,
  onError,
  onValidUserRole,
} from "../../helper/data_helper.js";
import { onValidProjectInfo } from "../../helper/project/project_data_helper.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";
import ProjectModel from "../../model/project/project.js";
import StepLogModel from "../../model/step_log/step_log.js";
import transportModel from "../../model/transport/transport.js";
import warehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";
const projectController = {
  addProject: async (req, res) => {
    try {
      const isValidUser = await onValidUserRole(req.header("Authorization"), [
        UserRole.SystemAdmin,
      ]);

      if (!isValidUser)
        return res
          .status(400)
          .send(onError(400, "Permission denied" + ERROR_MESSAGE));

      console.log("Userid", isValidUser._id.toString());

      const isValidProjectInfo = await onValidProjectInfo(
        req.body,
        isValidUser.email
      );

      if (isValidProjectInfo != null)
        return res.status(400).send(onError(400, isValidProjectInfo));

      const harvest = new harvestModel();
      const transport = new transportModel();
      const warehouseStorage = new warehouseStorageModel();
      const produce = new ProduceSupervisionModel();

      const project = new ProjectModel({
        harvest: harvest._id,
        transport: transport._id,
        warehouseStorage: warehouseStorage._id,
        produce: produce._id,
        projectName: req.body.projectName,
        projectCode: req.body.projectCode,
      });

      project.manager = isValidUser._id;
      project.projectLogList = [];

      harvest.projectId =
        transport.projectId =
        warehouseStorage.projectId =
        produce.projectId =
          project._id;

      harvest.projectCode =
        transport.projectCode =
        warehouseStorage.projectCode =
        produce.projectCode =
          req.body.projectCode;

      harvest.harvestId = harvest._id;
      transport.transportId = transport._id;
      warehouseStorage.warehouseStorageId = warehouseStorage._id;
      produce.produceSupervisionId = produce._id;

      harvest.save();
      transport.save();
      warehouseStorage.save();
      produce.save();

      project.projectId = project._id;
      await project.save();

      res.status(200).send({ msg: "Create project successfully", project });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateProject: async (req, res) => {
    try {
      const id = req.params.id;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid User Id"));
      }

      ProjectModel.findOne(
        { _id: req.params.id },
        async function (err, project) {
          if (err) {
            res.send(onError(422, "Update project failed"));
          } else {
            //update fields

            if (project != null) {
              if (project.state == 2) {
                return res
                  .status(400)
                  .send(
                    onError(
                      400,
                      "Project cannot be update because it has been completed"
                    )
                  );
              }
              for (var field in ProjectModel.schema.paths) {
                if (field !== "_id" && field !== "__v") {
                  if (req.body[field] !== undefined) {
                    project[field] = req.body[field];
                  }
                }
              }

              if (project.projectLogList == null) project.projectLogList = [];

              const stepLog = StepLogModel();
              stepLog.projectId = project._id;
              stepLog.actor = ObjectId(
                await getUserIdByHeader(req.header("Authorization"))
              );
              console.log("steplog before save", stepLog);
              await stepLog.save();

              setStepLogId(stepLog._id);
              project.projectLogList = project.projectLogList.concat({
                projectLog: stepLog._id,
              });
              await project.save();
              const theProject = await ProjectModel.findById(project._id)
                .populate("manager")
                .populate({
                  path: "harvest",
                  populate: {
                    path: "inspector",
                  },
                })
                .populate({
                  path: "transport",
                  populate: {
                    path: "inspector",
                  },
                })
                .populate({
                  path: "warehouseStorage",
                  populate: {
                    path: "inspector",
                  },
                })
                .populate({
                  path: "produce",
                  populate: {
                    path: "inspector",
                  },
                });

              res.status(200).send({
                project: theProject,
                contractContent:
                  Date.now().toString() +
                  "|" +
                  project.manager.toString() +
                  "|Project|" +
                  project.state,
              });
            } else {
              return res
                .status(400)
                .send(onError(400, "Project does not exist" + ERROR_MESSAGE));
            }
          }
        }
      );
    } catch (e) {
      res.status(500).send(onError(500, e.toString()));
    }
  },
  deleteProject: async (req, res) => {
    try {
      const id = req.params.id;

      if (!checkValidObjectId(id)) {
        return res
          .status(400)
          .send(onError(400, "Invalid User Id" + ERROR_MESSAGE));
      }

      const project = await ProjectModel.findById(id);
      project.state = 3;
      project.save();
      res.status(200).send({ msg: "Delete project success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllProjects: async (req, res) => {
    try {
      const projects = await ProjectModel.find({})
        .populate("manager")
        .populate("harvest")
        .populate("transport")
        .populate("warehouseStorage")
        .populate("produce")
        .exec();
      res.status(200).send(projects.reverse());
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getProject: async (req, res) => {
    try {
      const id = req.params.id;

      const project = await ProjectModel.findById(id)
        .populate("manager")
        .populate({
          path: "harvest",
          populate: {
            path: "inspector",
          },
        })
        .populate({
          path: "transport",
          populate: {
            path: "inspector",
          },
        })
        .populate({
          path: "warehouseStorage",
          populate: {
            path: "inspector",
          },
        })
        .populate({
          path: "produce",
          populate: {
            path: "inspector",
          },
        })
        .populate({
          path: "projectLogList",
          populate: {
            path: "projectLog",
          },
        })
        .exec();

      if (!project) {
        return res
          .status(400)
          .send(onError(400, "This project doesn't exist" + ERROR_MESSAGE));
      }

      res.status(200).send(project);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

export default projectController;
