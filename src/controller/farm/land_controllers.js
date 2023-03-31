import { checkValidObjectId, onError } from "../../helper/data_helper.js";
import { onValidLandInfo } from "../../helper/farm/land_data_helper.js";
import FarmModel from "../../model/farm/farm.js";
import LandModel from "../../model/farm/land.js";

// Land Controller //

const landController = {
  addLand: async (req, res) => {
    try {
      const { farmId } = req.body;

      if (!checkValidObjectId(farmId)) {
        return res.status(400).send(onError(400, "Invalid Farm Id"));
      }

      const isValidLandInfo = await onValidLandInfo(req.body);

      if (isValidLandInfo != null)
        return res.status(400).send(onError(400, isValidLandInfo));

      const farm = await FarmModel.findById(farmId);

      if (!farm) {
        return res.status(400).send(onError(400, "This farm doesn't exist"));
      }

      const newLand = new LandModel(req.body);
      newLand.landId = newLand._id;
      await newLand.save();

      await FarmModel.findByIdAndUpdate(farmId, {
        $push: {
          lands: newLand._id,
        },
      });

      res.status(200).send(newLand);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateLand: async (req, res) => {
    try {
      const { id } = req.params;
      const { landName, landArea, state } = req.body;

      if (!checkValidObjectId(id)) {
        res.status(400).send(onError(400, "Invalid Land Id"));
      }

      const landId = await LandModel.findById(id);

      if (!landId)
        return res.status(400).send(onError(400, "This land doesn't exist"));
      else if (!landName || !landArea || !state) {
        return res.status(400).send(onError(400, "Land name can't be blank!"));
      }
      const landModel = await LandModel.findByIdAndUpdate(id, {
        $set: {
          landName: landName,
          landArea: landArea,
          state: state,
        },
      });
      res.status(200).send(landModel);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  deleteLand: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Land Id"));
      }

      const land = await LandModel.findById(id);

      if (!land)
        return res.status(400).send(onError(400, "This land doesn't exist"));

      await FarmModel.findByIdAndUpdate(land.farmId, {
        $pull: {
          lands: land._id,
        },
      });

      await LandModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete land success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllLands: async (req, res) => {
    try {
      const lands = await LandModel.find().exec();
      res.status(200).send(lands);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getLand: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Land Id"));
      }

      const land = await LandModel.findById(id).exec();

      if (!land) {
        return res.status(400).send(onError(400, "This land doesn't exist"));
      }

      res.status(200).send(land);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllLandsInFarm: async (req, res) => {
    try {
      const { farmId } = req.params;

      const validFarm = await FarmModel.findOne({farmId: farmId});
      
      if(!validFarm) {
        res.status(400).send(onError(400), "This farm doesn't exist");
      }

      const lands = await LandModel.find({farmId: farmId});

      return res.status(200).send(lands);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

const LandService = { landController };

export default LandService;
