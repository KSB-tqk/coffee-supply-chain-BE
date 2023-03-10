import FarmModel from "../../model/Farm/farm.js";
import User from "../../model/user/user.js";
import {
  checkValidObjectId,
  checkValidAdminAccess,
  checkFarmer,
} from "../../helper/data_helper.js";


// Farm Controller

const farmController = {
  addFarm: async (req, res) => {
    try {     
      const farmCode = req.body.farmCode;
      const farmOwner = req.body.farmOwner;

      const checkFarmCodeExist = await FarmModel.findOne({ farmCode: farmCode });
      const checkFarmOwnerExist = await User.findById(farmOwner);

      if(checkFarmCodeExist) {
        res.status(400).send({ code: 400, message: "Farm Code already exists" });
      } else if (!checkFarmOwnerExist) {
        res.status(400).send({ code: 400, message: "User doesn't exist" });
      } else if(checkFarmer(farmOwner) === false) {
        res.status(400).send({ code: 400, message: "User isn't Farmer" })
      } else {
        const newFarm = new FarmModel(req.body);

        newFarm.farmId = newFarm._id;

        await newFarm.save();

        res.status(200).send({ code: 200, message: "Create farm success", farm: newFarm });
      }   
    } catch (err) {
      res.status(400).send({ code: 400,  message: err.message });
    }
  },
  addFarmerIntoFarm: async (req, res) => {
    try {
      
    } catch (err) {
      res.status(400).send({ code: 400, message: err.message });
    }
  },
  updateFarm: async (req, res) => {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = ["farmName", "farmAddress", "farmPhoneNumber"];

      try {
        const result = await checkValidAdminAccess(req.body.farmOwner);

        if (result) {
          return res.status(400).send({ error: "User " + result });
        } else {
          allowedUpdates.push("farmOwner");
        }
      } catch (err) {
        return res.status(400).send({ error: err.toString() });
      }

      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(req.params.id);

      if (!farm)
        return res.status(400).send({ msg: "This farm doesn't exist" });
      else if (!farm.farmName || !farm.farmAddress || !farm.farmPhoneNumber) {
        return res.status(400).send({ msg: "Farm info can't be blank!" });
      }

      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates" });
      }

      updates.forEach((update) => {
        farm[update] = req.body[update];
      });

      await farm.save();
      if (!farm) {
        return res.status(400).send(e.toString());
      } else {
        return res
          .status(200)
          .send({ msg: `Update farm success`, farm: farm });
      }
    } catch (err) {
      res.status(400).send({ msg: err.toString() });
    }
  },
  getFarm: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(id).populate("farmOwner").exec();

      if (!farm) return res.status(400).send({ msg: "No exist farm" });

      res.status(200).send(farm);
    } catch (err) {
      res.status(400).send({ msg: err.msg });
    }
  },
  getAllFarms: async (req, res) => {
    try {
      const farms = await FarmModel.find().exec();

      res.status(200).send(farms);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  deleteFarms: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send({ error: "Invalid Farm Id" });
      }

      const farm = await FarmModel.findById(id);

      if (!farm)
        return res.status(400).send({ msg: "This farm doesn't exist" });

      await FarmModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm success", farmId: farm._id });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

const FarmServices = { farmController };

export default FarmServices;
