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
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import {
  onUpdateProjectState,
  onValidProjectInfo,
} from "../../helper/project/project_data_helper.js";
import FarmProjectModel from "../../model/farm/farm_project.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";
import ProjectModel from "../../model/project/project.js";
import StepLogModel from "../../model/step_log/step_log.js";
import transportModel from "../../model/transport/transport.js";
import User from "../../model/user/user.js";
import UserDepartment from "../../enum/user_department.js";
import warehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";
const projectController = {
  addProject: async (req, res) => {
    try {
      const isValidUser = await onValidUserRole(req.header("Authorization"), [
        UserRole.SystemAdmin,
        UserRole.TechAdmin,
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

      if (req.body.farmProjectId != null) {
        project.farmProjectId = req.body.farmProjectId;
        const farmProject = await FarmProjectModel.findOne({
          _id: project.farmProjectId,
        });
        if (farmProject == null) {
          return res
            .status(404)
            .send(onError(404, "Farm Project does not exist" + ERROR_MESSAGE));
        }

        if (farmProject.projectId != null) {
          const existProject = await ProjectModel.findOne({
            _id: farmProject.projectId,
          });

          if (existProject != null)
            return res
              .status(400)
              .send(
                onError(
                  400,
                  "Farm Project already had already been add to another project" +
                    ERROR_MESSAGE
                )
              );
        }

        farmProject.projectId = project._id;
        farmProject.save();
        project.farmProject = farmProject;
      }

      //
      //  check valid for adding staff to harvest step
      //
      if (req.body.harvestor != null) {
        const user = await User.findOne({ _id: req.body.harvestor });
        if (user == null) {
          return res
            .status(404)
            .send(
              onError(
                404,
                "User in harvest department not found" + ERROR_MESSAGE
              )
            );
        }

        if (
          user.role != UserRole.Staff ||
          user.department != UserDepartment.HarvestInspector
        ) {
          return res
            .status(404)
            .send(
              onError(
                404,
                "Staff does not have permission for Harvestor" + ERROR_MESSAGE
              )
            );
        }

        if (
          !(await onValidUserDepartment(user, [
            UserDepartment.HarvestInspector,
          ]))
        )
          return res
            .status(400)
            .send(
              onError(
                400,
                "User is not participate in Harvest department" + ERROR_MESSAGE
              )
            );

        if (
          (await onValidUserRole(req.header("Authorization"), [
            UserRole.SystemAdmin,
            UserRole.TechAdmin,
          ])) == false
        )
          return res
            .status(400)
            .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

        harvest.inspector = user._id;
      }
      //
      //  check valid for adding staff to harvest step
      //

      //
      // check valid for adding staff to transport step
      //
      if (req.body.transportInspector != null) {
        const user = await User.findOne({ _id: req.body.transportInspector });

        if (user == null)
          return res
            .status(404)
            .send(
              onError(
                404,
                "User in transport department not found " + ERROR_MESSAGE
              )
            );

        if (
          !(await onValidUserDepartment(user, [
            UserDepartment.TransportSupervision,
          ]))
        )
          return res
            .status(400)
            .send(
              onError(
                400,
                "User is not participate in Transport department" +
                  ERROR_MESSAGE
              )
            );

        if (
          (await onValidUserRole(req.header("Authorization"), [
            UserRole.SystemAdmin,
            UserRole.TechAdmin,
          ])) == false
        )
          return res
            .status(400)
            .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

        transport.inspector = user._id;
      }
      //
      // check valid for adding staff to transport step
      //

      //
      // check valid for adding staff to produce step
      //
      if (req.body.produceInspector != null) {
        const user = await User.findOne({ _id: req.body.produceInspector });

        if (user == null)
          return res
            .status(404)
            .send(
              onError(
                404,
                "User in produce supervision department not found" +
                  req.body.produceInspector +
                  " " +
                  ERROR_MESSAGE
              )
            );

        if (
          !(await onValidUserDepartment(user, [
            UserDepartment.SupervisingProduce,
          ]))
        )
          return res
            .status(400)
            .send(
              onError(
                400,
                "User is not participate in Produce Supervision department" +
                  ERROR_MESSAGE
              )
            );

        if (
          (await onValidUserRole(req.header("Authorization"), [
            UserRole.SystemAdmin,
            UserRole.TechAdmin,
          ])) == false
        )
          return res
            .status(400)
            .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

        produce.inspector = user._id;
      }
      //
      // check valid for adding staff to produce step
      //

      //
      // check valid for adding staff to warehouse storage step
      //
      if (req.body.warehouseInspector != null) {
        const user = await User.findOne({ _id: req.body.warehouseInspector });
        if (user == null)
          return res
            .status(404)
            .send(
              onError(
                404,
                "User in warehouse storage department not found" + ERROR_MESSAGE
              )
            );

        if (
          !(await onValidUserDepartment(user, [
            UserDepartment.WarehouseSupervision,
          ]))
        )
          return res
            .status(400)
            .send(
              onError(
                400,
                "User is not participate in Warehouse Storage department" +
                  ERROR_MESSAGE
              )
            );

        if (
          (await onValidUserRole(req.header("Authorization"), [
            UserRole.SystemAdmin,
            UserRole.TechAdmin,
          ])) == false
        )
          return res
            .status(400)
            .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

        warehouseStorage.inspector = user._id;
      }
      //
      // check valid for adding staff to warehouse storage step
      //

      project.manager = isValidUser._id;
      project.projectLogList = [];

      // add projectId
      harvest.projectId =
        transport.projectId =
        warehouseStorage.projectId =
        produce.projectId =
          project._id;

      // add projectCode
      harvest.projectCode =
        transport.projectCode =
        warehouseStorage.projectCode =
        produce.projectCode =
          req.body.projectCode;

      // add shadowId
      harvest.harvestId = harvest._id;
      transport.transportId = transport._id;
      warehouseStorage.warehouseStorageId = warehouseStorage._id;
      produce.produceId = produce._id;

      // save all step
      harvest.save();
      transport.save();
      warehouseStorage.save();
      produce.save();

      // save project
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
              // save model before change
              let stepLog = StepLogModel();
              stepLog.projectId = project._id;
              stepLog.actor = ObjectId(
                await getUserIdByHeader(req.header("Authorization"))
              );
              stepLog.modelBeforeChanged = JSON.stringify(project);
              console.log("steplog before save", stepLog);
              await stepLog.save();

              // check if update farmPJ
              if (req.body.farmProject != null) {
                const farmProject = await FarmProjectModel.findById(
                  req.body.farmProject
                );
                if (farmProject == null)
                  return res
                    .status(400)
                    .send(
                      onError(
                        400,
                        "Farm Project does not exist" + ERROR_MESSAGE
                      )
                    );
                farmProject.projectId = project._id;
                farmProject.save();
                project.farmProject = farmProject._id;
              }

              // check if project is completed
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

              // update project by req.body
              for (var field in ProjectModel.schema.paths) {
                if (field !== "_id" && field !== "__v") {
                  if (req.body[field] !== undefined) {
                    project[field] = req.body[field];
                  }
                }
              }

              // check and update step's state in project
              let tempProject = ProjectModel();

              if (req.body.state != null) {
                console.log("OnUpdate State");
                try {
                  tempProject = await onUpdateProjectState(
                    project,
                    req.body.state
                  );
                } catch (err) {
                  console.log(err);
                  return res.status(400).send(onError(400, err.message));
                }
              }

              // update project after update the step inside
              project.dateCompleted = tempProject.dateCompleted;
              project.state = tempProject.state;

              // update project log list
              if (project.projectLogList == null) project.projectLogList = [];

              project.logId = stepLog._id;
              project.projectLogList = project.projectLogList.concat({
                projectLog: stepLog._id,
              });

              // save, populate and resend project model
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

              // save the model after changed
              stepLog = await StepLogModel.findById(project.logId);
              stepLog.modelAfterChanged = JSON.stringify(project);
              console.log("Step Log Final", stepLog);
              stepLog.save();

              // resend model after finish request
              res.status(200).send({
                project: theProject,
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
      res.status(500).send(onError(500, e.message));
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
        .populate("farmProject")
        .exec();

      if (!project) {
        return res
          .status(400)
          .send(onError(400, "This project doesn't exist" + ERROR_MESSAGE));
      }

      res.status(200).send(project);
    } catch (err) {
      return res.status(400).send(onError(400, err.message));
    }
  },

  getProjectWithoutToken: async (req, res) => {
    try {
      const id = req.query.id;

      console.log("Use this function");

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
        .populate("farmProject")
        .exec();

      if (!project) {
        return res
          .status(400)
          .send(onError(400, "This project doesn't exist" + ERROR_MESSAGE));
      }

      res.status(200).send(project);
    } catch (err) {
      return res.status(400).send(onError(400, err.message));
    }
  },
  getProjectByMonth: async (req, res) => {
    try {
      const listProject = await ProjectModel.find({
        $expr: { $eq: [{ $month: "$dateCreated" }, req.query.month] },
      });

      res.send(listProject);
    } catch (err) {
      return res.status(400).send(onError(400, err.message));
    }
  },
};

export default projectController;
