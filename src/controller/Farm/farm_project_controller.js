import FarmModel from "../../model/Farm/farm.js";
import FarmProjectModel from "../../model/Farm/farm_project.js";
import LandModel from "../../model/Farm/land.js";
import SeedModel from "../../model/Farm/seed.js";

const farmProjectController = {
  addFarmProject: async (req, res) => {
    try {
      const { farmId } = req.body;

      const farm = await FarmModel.findById(farmId);

      if (!farm)
        return res.status(400).json({ msg: "This farm doesn't exist" });

      const newFarmProject = new FarmProjectModel(req.body);
      await newFarmProject.save();

      await FarmModel.findByIdAndUpdate(farmId, {
        $push: {
          farmProjects: newFarmProject._id,
        },
      });

      res.status(200).json({ msg: "Create new farm project success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  updateFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

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

      const landProject = await LandModel.findById(land).exec();

      const seedProject = await SeedModel.findById(seed).exec();

      if (!farmProject)
        return res.status(400).json({ msg: "This farm project doesn't exist" });
      else if (!landProject)
        return res.status(400).json({ msg: "This land doesn't exist" });
      else if (!seedProject)
        return res.status(400).json({ msg: "This land doesn't exist" });
      else if (!farmProjectName || !dateCreated || !state) {
        return res.status(400).json({ msg: "Farm Prject Info can't be blank" });
      } else if (totalHarvest < 0) {
        return res
          .status(400)
          .json({ msg: "Total harvest must be greater than 0" });
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

        return res.status(200).json({ msg: "Update farm project success" });
      }
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  deleteFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id);

      if (!farmProject)
        return res.status(400).json({ msg: "This farm project doesn't exist" });

      await FarmModel.findByIdAndUpdate(farmProject.farmId, {
        $pull: {
          farmProjects: farmProject._id,
        },
      });

      await FarmProjectModel.findByIdAndRemove(id);
      res.status(200).json({ msg: "Delete farm project success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getAllFarmProjects: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProjects = await FarmProjectModel.find({ farmId: id })
        .populate(["land", "seed"])
        .exec();
      res.status(200).json(farmProjects);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getFarmProject: async (req, res) => {
    try {
      const { id } = req.params;

      const farmProject = await FarmProjectModel.findById(id)
        .populate(["land", "seed"])
        .exec();

      if (!farmProject)
        return res.status(400).json({ msg: "This farm project doesn't exist" });

      res.status(200).json(farmProject);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};

const FarmProjectServices = { farmProjectController };

export default FarmProjectServices;
