import HarvestModel from "../../model/harvest/harvest.js";
const harvestController = {
  addHarvest: async (req, res) => {
    try {
      const harvest = new HarvestModel(req.body);

      const farm = await HarvestModel.findById(harvest._id);

      if (!farm) {
        return res.status(400).json({ msg: "This harvest doesn't exist" });
      }

      await harvest.save();
      // ok

      await HarvestModel.findByIdAndUpdate(farmId, {
        $push: {
          lands: newLand._id,
        },
      });

      res.status(200).json({ msg: "Create land success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  updateLand: async (req, res) => {
    try {
      const { id } = req.params;
      const { landName, landArea, state } = req.body;

      const landId = await LandModel.findById(id);

      if (!landId)
        return res.status(400).json({ msg: "This land doesn't exist" });
      else if (!landName || !landArea || !state) {
        return res.status(400).json({ msg: "Seed name can't be blank!" });
      }
      await LandModel.findByIdAndUpdate(id, {
        $set: {
          landName: landName,
          landArea: landArea,
          state: state,
        },
      });
      res.status(200).json({ msg: `Update seed success` });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  deleteLand: async (req, res) => {
    try {
      const { id } = req.params;

      const land = await LandModel.findById(id);

      if (!land)
        return res.status(400).json({ msg: "This land doesn't exist" });

      await HarvestModel.findByIdAndUpdate(land.farmId, {
        $pull: {
          lands: land._id,
        },
      });

      await LandModel.findByIdAndRemove(id);
      res.status(200).json({ msg: "Delete land success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getAllLands: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const lands = await LandModel.find({ farmId: id }).exec();
      res.status(200).json(lands);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getLand: async (req, res) => {
    try {
      const { id } = req.params;

      const land = await LandModel.findById(id).exec();

      if (!land) {
        return res.status(400).json({ msg: "This land doesn't exist" });
      }

      res.status(200).json(land);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};
