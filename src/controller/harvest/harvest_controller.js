import HarvestModel from "../../model/harvest/harvest.js";
const harvestController = {
  addHarvest: async (req, res) => {
    try {
      const harvest = new HarvestModel(req.body);

      await harvest.save();

      res.status(200).json({ msg: "Create harvest successfully", harvest });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  updateHarvest: async (req, res) => {
    const id = req.params.id;

    const harvest = await HarvestModel.findById(id).exec();

    if (!harvest) {
      return res.status(400).json({ msg: "This harvest doesn't exist" });
    }

    HarvestModel.findOne({ _id: id }, function (err, harvest) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        for (var field in HarvestModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              harvest[field] = req.body[field];
            }
          }
        }
        harvest.save();
        res.status(200).send({ harvest });
      }
    });
  },
  deleteHarvest: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await HarvestModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).json({ msg: "This harvest doesn't exist" });
      }

      await HarvestModel.findByIdAndRemove(id);
      res.status(200).json({ msg: "Delete harvest success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getAllHarvests: async (req, res) => {
    try {
      const harvest = await HarvestModel.find();
      res.status(200).json(harvest);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getHarvest: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await HarvestModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).json({ msg: "This harvest doesn't exist" });
      }

      res.status(200).json(harvest);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};

export default harvestController;
