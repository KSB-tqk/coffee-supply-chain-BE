import FarmModel from "../../model/Farm/farm.js";
import User from "../../model/user/user.js";
import {
  checkValidObjectId,
  checkValidAdminAccess,
  checkFarmer,
  onError,
  onValidUserRole,
  checkValidUserInfo,
  compareUserIdWithToken,
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

        newFarm.farmers = [];
        newFarm.farmers = newFarm.farmers.concat({
          farmer: checkFarmOwnerExist._id,
        });
        newFarm.farmId = newFarm._id;

        await newFarm.save();

        const resultNewFarm = await newFarm.populate("farmOwner");

        res.status(200).send({
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

      const farmModel = await FarmModel.findById(req.params.id);

      const userModel = await User.findOne({ email: emailNewFarmer });

      if (userModel == null) {
        return res
          .status(400)
          .send(
            onError(
              400,
              "This email doesn't link to any account yet, please try again."
            )
          );
      }

      const checkUserWasAdded = await FarmModel.findOne({
        "farmers.farmer": userModel._id,
      });

      if (farmModel == null) {
        return res.status(400).send(onError(400, "This farm doesn't exist"));
      } else if (checkUserWasAdded) {
        return res
          .status(400)
          .send(
            onError(
              400,
              "This user was already been added to the farm, please try again."
            )
          );
      }

      if (farmModel.farmers == null) farmModel.farmers = [];
      farmModel.farmers = farmModel.farmers.concat({
        farmer: userModel._id,
      });
      farmModel.save();

      return res.status(200).send(farmModel);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateFarm: async (req, res) => {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = ["farmName", "farmAddress", "farmPhoneNumber"];

      const farm = await FarmModel.findById(req.params.id);

      if (!farm)
        return res.status(400).send(onError(400, "This farm doesn't exist"));
      else if (!farm.farmName || !farm.farmAddress || !farm.farmPhoneNumber) {
        return res.status(400).send(onError(400, "Farm info can't be blank!"));
      }

      try {
        const result = await compareUserIdWithToken(
          req.header("Authorization").replace("Bearer ", ""),
          farm.farmOwner
        );
        if (!result) {
          return res
            .status(400)
            .send(onError(400, "Unauthorized Farm Owner, please try again."));
        } else {
          allowedUpdates.push("farmOwner");
        }
      } catch (err) {
        return res.status(400).send(onError(400, err.toString()));
      }

      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send(onError(400, "Invalid Farm Id"));
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
      if (
        await onValidUserRole(
          req.header("Authorization").replace("Bearer ", ""),
          1 // RoleTypeId (TechAdmin - 1)
        )
      ) {
        const farms = await FarmModel.find().exec();
        res.status(200).send(farms);
      } else {
        return res
          .status(400)
          .send(onError(400, "Permission denied, please check and try again."));
      }
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
