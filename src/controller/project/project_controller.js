import { checkValidObjectId } from "../../helper/data_helper.js";
import harvestModel from "../../model/harvest/harvest.js";
import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";
import ProjectModel from "../../model/project/project.js";
import shippingModel from "../../model/shipping/shipping.js";
import warehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";
const projectController = {
  addProject: async (req, res) => {
    try {
      const harvest = new harvestModel();
      const shipping = new shippingModel();
      const warehouseStorage = new warehouseStorageModel();
      const produce = new ProduceSupervisionModel();

      const project = new ProjectModel({
        manager: req.body.manager,
        harvest: harvest._id,
        shipping: shipping._id,
        warehouseStorage: warehouseStorage._id,
        produce: produce._id,
        projectName: req.body.projectName,
        projectCode: req.body.projectCode,
      });

      harvest.projectId =
        shipping.projectId =
        warehouseStorage.projectId =
        produce.projectId =
          project._id;

      harvest.inspector =
        shipping.inspector =
        warehouseStorage.inspector =
        produce.inspector =
          project.manager;

      harvest.save();
      shipping.save();
      warehouseStorage.save();
      produce.save();

      await project.save();

      res.status(200).send({ msg: "Create project successfully", project });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateProject: async (req, res) => {
    const id = req.params.id;

    if (!checkValidObjectId(id)) {
      return res.status(400).send({ error: "Invalid User Id" });
    }

    ProjectModel.findOne({ _id: req.params.id }, function (err, project) {
      if (err) {
        res.send(422, "Update project failed");
      } else {
        //update fields
        for (var field in ProjectModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              project[field] = req.body[field];
            }
          }
        }
        project.save();
        res.status(200).send({ project });
      }
    });
  },
  deleteProject: async (req, res) => {
    try {
      const id = req.params.id;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid User Id" });
      }

      await ProjectModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete project success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllProjects: async (req, res) => {
    try {
      const projects = await ProjectModel.find({})
        .populate("manager")
        .populate("harvest")
        .populate("shipping")
        .populate("warehouseStorage")
        .populate("produce")
        .exec();
      res.status(200).send(projects);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getProject: async (req, res) => {
    try {
      const id = req.params.id;

      const project = await ProjectModel.find({ _id: id })
        .populate("manager")
        .populate("harvest")
        .populate("shipping")
        .populate("warehouseStorage")
        .populate("produce")
        .exec();

      if (!project) {
        return res.status(400).send({ msg: "This project doesn't exist" });
      }

      res.status(200).send(project);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

export default projectController;
