import { checkValidObjectId } from "../../helper/data_helper.js";
import Project from "../../model/project/project.js";

const projectController = {
  addProject: async (req, res) => {
    try {
      const project = new Project(req.body);

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

    Project.findOne({ _id: req.params.id }, function (err, project) {
      if (err) {
        res.send(422, "Update project failed");
      } else {
        //update fields
        for (var field in Project.schema.paths) {
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

      await Project.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete project success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllProjects: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const lands = await Project.find({ farmId: id }).exec();
      res.status(200).send(lands);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getProject: async (req, res) => {
    try {
      const id = req.params.id;

      const project = await Project.findById(id).exec();

      if (!project) {
        return res.status(400).send({ msg: "This project doesn't exist" });
      }

      res.status(200).send(project);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};
