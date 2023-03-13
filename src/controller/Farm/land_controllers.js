import LandModel from "../../model/Farm/land.js";

// Land Controller //

const landController = {
    addLand: async (req, res) => {
      try {
        const { farmId } = req.body;
  
        if (!checkValidObjectId(farmId)) {
          return res.status(400).send({ error: "Invalid Farm Id" });
        }
  
        const farm = await FarmModel.findById(farmId);
  
        if (!farm) {
          return res.status(400).send({ msg: "This farm doesn't exist" });
        }
  
        const newLand = new LandModel(req.body);
        await newLand.save();
  
        await FarmModel.findByIdAndUpdate(farmId, {
          $push: {
            lands: newLand._id,
          },
        });
  
        res.status(200).send({ msg: "Create land success" });
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    updateLand: async (req, res) => {
      try {
        const { id } = req.params;
        const { landName, landArea, state } = req.body;
  
        if (!checkValidObjectId(id)) {
          res.status(400).send({ error: "Invalid Land Id" });
        }
  
        const landId = await LandModel.findById(id);
  
        if (!landId)
          return res.status(400).send({ msg: "This land doesn't exist" });
        else if (!landName || !landArea || !state) {
          return res.status(400).send({ msg: "Seed name can't be blank!" });
        }
        await LandModel.findByIdAndUpdate(id, {
          $set: {
            landName: landName,
            landArea: landArea,
            state: state,
          },
        });
        res.status(200).send({ msg: `Update seed success` });
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    deleteLand: async (req, res) => {
      try {
        const { id } = req.params;
  
        if (!checkValidObjectId(id)) {
          return res.status(400).send({ error: "Invalid Land Id" });
        }
  
        const land = await LandModel.findById(id);
  
        if (!land)
          return res.status(400).send({ msg: "This land doesn't exist" });
  
        await FarmModel.findByIdAndUpdate(land.farmId, {
          $pull: {
            lands: land._id,
          },
        });
  
        await LandModel.findByIdAndRemove(id);
        res.status(200).send({ msg: "Delete land success" });
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    getAllLands: async (req, res) => {
      try {
        const { id } = req.params;
  
        console.log(id);
  
        const lands = await LandModel.find({ farmId: id }).exec();
        res.status(200).send(lands);
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
    getLand: async (req, res) => {
      try {
        const { id } = req.params;
  
        if (!checkValidObjectId(id)) {
          return res.status(400).send({ error: "Invalid Land Id" });
        }
  
        const land = await LandModel.findById(id).exec();
  
        if (!land) {
          return res.status(400).send({ msg: "This land doesn't exist" });
        }
  
        res.status(200).send(land);
      } catch (err) {
        res.status(400).send({ msg: err.message });
      }
    },
};

const LandService = { landController };

export default LandService;