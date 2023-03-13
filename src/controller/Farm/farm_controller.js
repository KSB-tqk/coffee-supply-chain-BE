import FarmModel from "../../model/Farm/farm.js";
import User from "../../model/user/user.js";
import {
  checkValidObjectId,
  checkValidAdminAccess,
  checkFarmer,
  onError,
} from "../../helper/data_helper.js";

// Farm Controller

const farmController = {
  addFarm: async (req, res) => {
    try {
      const { farmCode, farmName, farmAddress, farmPhoneNumber, farmOwner } =
        req.body;

      const checkFarmCodeExist = await FarmModel.findOne({
        farmCode: farmCode,
      });
      const checkFarmOwnerExist = await User.findOne({ email: farmOwner });

      console.log(checkFarmOwnerExist._id.toString());

      if (checkFarmCodeExist) {
        res.status(400).send(onError(400, "Farm Code already exists"));
      } else if (!checkFarmOwnerExist) {
        res.status(400).send(onError(400, "User doesn't exist"));
      } else if (checkFarmOwnerExist.role !== 3) {
        res.status(400).send(onError(400, "User isn't a Farmer"));
      } else {
        const newFarm = new FarmModel({
          farmCode: farmCode,
          farmName: farmName,
          farmAddress: farmAddress,
          farmPhoneNumber: farmPhoneNumber,
          farmOwner: checkFarmOwnerExist._id.toString(),
        });

        newFarm.farmId = newFarm._id;

        await newFarm.save();

        const resultNewFarm = await newFarm.populate("farmOwner");

        res
          .status(200)
          .send({
            code: 200,
            message: "Create farm success",
            farm: resultNewFarm,
          });
      }
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  addFarmerIntoFarm: async (req, res) => {
    try {
      const famrId = req.params; // id of farm
      const { emailNewFarmer } = req.body;

      const checkFarmerExist = await FarmModel.findById(req.params);

      const checkUserExist = await User.findOne({ email: emailNewFarmer });

      const checkUserWasAdded = await FarmModel.find({
        farmer: { $exists: checkUserExist._id },
      });

      if (!checkFarmerExist) {
        res.status(400).send(onError(400, "This farm doesn't exist"));
      } else if (!checkUserExist) {
        res.status(400).send(onError(400, "This email doesn't exist"));
      } else if (!checkUserWasAdded) {
        res.status(400).send(onError(400, "This user was added in farmer"));
      }
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateFarm: async (req, res) => {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = ["farmName", "farmAddress", "farmPhoneNumber"];

      try {
        const result = await checkValidAdminAccess(req.body.farmOwner);

        if (result) {
          return res.status(400).send(onError(400, "User " + result));
        } else {
          allowedUpdates.push("farmOwner");
        }
      } catch (err) {
        return res.status(400).send(onError(400, err.toString()));
      }

      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send(onError(400, "Invalid Farm Id"));
      }

      const farm = await FarmModel.findById(req.params.id);

      if (!farm)
        return res.status(400).send(onError(400, "This farm doesn't exist"));
      else if (!farm.farmName || !farm.farmAddress || !farm.farmPhoneNumber) {
        return res.status(400).send(onError(400, "Farm info can't be blank!"));
      }

      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).send(onError(400, "Invalid updates"));
      }

      updates.forEach((update) => {
        farm[update] = req.body[update];
      });

      await farm.save();
      if (!farm) {
        return res.status(400).send(onError(400, e.toString()));
      } else {
        return res.status(200).send({ msg: `Update farm success`, farm: farm });
      }
    } catch (err) {
      res.status(400).send(onError(400, err.toString()));
    }
  },
  getFarm: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Farm Id"));
      }

      const farm = await FarmModel.findById(id).populate("farmOwner").exec();

      if (!farm) return res.status(400).send(onError(400, "No exist farm"));

      res.status(200).send(farm);
    } catch (err) {
      res.status(400).send(onError(400, err.msg));
    }
  },
  getAllFarms: async (req, res) => {
    try {
      const farms = await FarmModel.find().exec();

      res.status(200).send(farms);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  deleteFarms: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onError(400, "Invalid Farm Id"));
      }

      const farm = await FarmModel.findById(id);

      if (!farm)
        return res.status(400).send(onError(400, "This farm doesn't exist"));

      await FarmModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm success", farmId: farm._id });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

const FarmServices = { farmController };

export default FarmServices;
