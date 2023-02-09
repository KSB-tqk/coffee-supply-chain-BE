import { checkValidObjectId } from "../../helper/data_helper.js";
import ProjectModel from "../../model/project/project.js";

const projectController = {
  addProject: async (req, res) => {
    try {
      const project = new ProjectModel(req.body);

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
        .populate("farm")
        .populate("farmProject")
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
        .populate("farm")
        .populate("farmProject")
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
