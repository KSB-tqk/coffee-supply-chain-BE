import FarmModel from "../../model/farm/farm.js";
import User from "../../model/user/user.js";
import {
  checkValidObjectId,
  checkValidAdminAccess,
  checkFarmer,
  onResponse,
  onValidUserRole,
  checkValidUserInfo,
  compareUserIdWithToken,
  onError,
} from "../../helper/data_helper.js";
import UserRole from "../../enum/user_role.js";
import { ERROR_MESSAGE } from "../../enum/app_const.js";
import SeedModel from "../../model/farm/seed.js";
import LandModel from "../../model/farm/land.js";
import FarmProjectModel from "../../model/farm/farm_project.js";

// Farm Controller

const farmController = {
  addFarm: async (req, res) => {
    try {
      const { farmCode, farmName, farmAddress, farmPhoneNumber } = req.body;

      const isValidFarmCode = await FarmModel.findOne({
        farmCode: farmCode,
      });

      let isValidFarmOwner = null;
      if (req.body.farmOwner != null) {
        isValidFarmOwner = await User.findOne({ email: req.body.farmOwner });

        if (isValidFarmOwner == null)
          return res
            .status(400)
            .send(onError(400, "Farm owner not found" + ERROR_MESSAGE));
        else if (
          !(await onValidUserRole(req.header("Authorization"), [
            UserRole.TechAdmin,
          ]))
        ) {
          return res
            .status(400)
            .send(
              onError(
                400,
                "Unauthorized to set other user as farm owner" + ERROR_MESSAGE
              )
            );
        } else if (isValidFarmOwner.farmId != null) {
          res
            .status(400)
            .send(
              onResponse(
                400,
                "User had already been set to be Owner of another farm" +
                  ERROR_MESSAGE
              )
            );
        }
      }

      if (isValidFarmCode) {
        res.status(400).send(onResponse(400, "Farm Code already exists"));
      } else if (
        !(await onValidUserRole(req.header("Authorization"), [
          UserRole.TechAdmin,
          UserRole.Farmer,
        ]))
      ) {
        return res.status(400).send(onResponse(400, "User isn't a Farmer"));
      } else {
        let newFarm = new FarmModel({
          farmCode: farmCode,
          farmName: farmName,
          farmAddress: farmAddress,
          farmPhoneNumber: farmPhoneNumber,
        });

        if (isValidFarmOwner != null) {
          newFarm.farmOwner = isValidFarmOwner._id.toString();
          newFarm.farmerList = [];
          newFarm.farmerList = newFarm.farmerList.concat({
            farmer: isValidFarmOwner._id,
          });

          isValidFarmOwner.farmId = newFarm._id;
          isValidFarmOwner.isOwner = true;
          await isValidFarmOwner.save();
        }

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
      res.status(400).send(onResponse(400, err.message));
    }
  },
  addFarmerIntoFarm: async (req, res) => {
    try {
      const { email } = req.body;

      console.log("email", email);

      const farmModel = await FarmModel.findById(req.params.id);

      const userModel = await User.findOne({ email: email });

      if (userModel == null) {
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "This email doesn't link to any account yet, please try again."
            )
          );
      }

      const checkUserWasAdded =
        (await FarmModel.findOne({
          farmId: farmModel._id,
          "farmerList.farmer": userModel._id,
        })) || userModel.farmId != null;

      if (farmModel == null) {
        return res.status(400).send(onResponse(400, "This farm doesn't exist"));
      } else if (checkUserWasAdded) {
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "This user was already been added to the farm, please try again."
            )
          );
      }

      if (farmModel.farmerList == null) farmModel.farmerList = [];

      if (
        // Only farmOwner can add farmer into farm
        // check if the request author is farmOwner or not
        // and TechAdmin can also do it
        (await compareUserIdWithToken(
          req.header("Authorization"),
          farmModel.farmOwner
        )) ||
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.TechAdmin,
        ]))
      ) {
        if (farmModel.farmOwner == null) {
          userModel.farmId = farmModel._id;
          userModel.isOwner = true;
          farmModel.farmOwner = userModel._id;
        } else {
          userModel.farmId = farmModel._id;
        }
        if (farmModel.farmerList == null) farmModel.farmerList = [];
        farmModel.farmerList = farmModel.farmerList.concat({
          farmer: userModel._id,
        });

        userModel.save();
        farmModel.save();
      } else {
        return res
          .status(400)
          .send(
            onResponse(400, "Permission denied, please check and try again.")
          );
      }

      return res.status(200).send(farmModel);
    } catch (err) {
      res.status(400).send(onResponse(400, err.message));
    }
  },
  updateFarm: async (req, res) => {
    try {
      const updates = Object.keys(req.body);

      const allowedUpdates = [
        "farmName",
        "farmAddress",
        "farmPhoneNumber",
        "farmCode",
      ];

      const farm = await FarmModel.findById(req.params.id);

      if (!farm)
        return res.status(400).send(onResponse(400, "This farm doesn't exist"));
      else if (!farm.farmName || !farm.farmAddress || !farm.farmPhoneNumber) {
        return res
          .status(400)
          .send(onResponse(400, "Farm info can't be blank!"));
      }

      try {
        const result =
          (await compareUserIdWithToken(
            req.header("Authorization"),
            farm.farmOwner
          )) ||
          (await onValidUserRole(req.header("Authorization"), [
            UserRole.TechAdmin,
            UserRole.SystemAdmin,
          ]));
        if (!result) {
          return res
            .status(400)
            .send(
              onResponse(400, "Unauthorized Farm Owner, please try again.")
            );
        } else {
          allowedUpdates.push("statusFarm");
        }
      } catch (err) {
        return res.status(400).send(onResponse(400, err.message));
      }

      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send(onResponse(400, "Invalid Farm Id"));
      }

      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return res.status(400).send(onResponse(400, "Invalid updates"));
      }

      updates.forEach((update) => {
        farm[update] = req.body[update];
      });

      await farm.save();
      if (!farm) {
        return res.status(400).send(onResponse(400, e.message));
      } else {
        return res.status(200).send({ msg: `Update farm success`, farm: farm });
      }
    } catch (err) {
      res.status(400).send(onResponse(400, err.message));
    }
  },
  getFarm: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onResponse(400, "Invalid Farm Id"));
      }

      const farm = await FarmModel.findById(id)
        .populate("farmOwner")
        .populate({
          path: "farmerList",
          populate: {
            path: "farmer",
          },
        })
        .populate({
          path: "farmProjectList",
          populate: {
            path: "farmProject",
          },
        })
        .populate({
          path: "landList",
          populate: {
            path: "land",
          },
        })
        .populate({
          path: "seedList",
          populate: {
            path: "seed",
          },
        })
        .exec();
      if (!farm) return res.status(400).send(onResponse(400, "No exist farm"));

      res.status(200).send(farm);
    } catch (err) {
      res.status(400).send(onResponse(400, err.message));
    }
  },
  getAllFarms: async (req, res) => {
    try {
      if (
        await onValidUserRole(req.header("Authorization"), [
          UserRole.TechAdmin,
          UserRole.SystemAdmin,
        ])
      ) {
        const farms = await FarmModel.find().exec();
        res.status(200).send(farms);
      } else {
        return res
          .status(400)
          .send(
            onResponse(400, "Permission denied, please check and try again.")
          );
      }
    } catch (err) {
      res.status(400).send(onResponse(400, err.message));
    }
  },
  deleteFarms: async (req, res) => {
    try {
      const { id } = req.params;

      if (!checkValidObjectId(id)) {
        return res.status(400).send(onResponse(400, "Invalid Farm Id"));
      }

      const farm = await FarmModel.findById(id);

      if (!farm)
        return res.status(400).send(onResponse(400, "This farm doesn't exist"));

      await FarmModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete farm success", farmId: farm._id });
    } catch (err) {
      res.status(400).send(onResponse(400, err.message));
    }
  },
  removeFarmerFromFarm: async (req, res) => {
    try {
      const email = req.body.email;
      const userModel = await User.findOne({ email: email });

      if (userModel == null) {
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "This email doesn't link to any account yet, please try again."
            )
          );
      }

      const id = userModel._id;
      const farmModel = await FarmModel.findOne({
        _id: req.params.id,
        "farmerList.farmer": id,
      });

      if (farmModel != null) {
        const bearerHeader = req.header("Authorization");
        if (
          // check if the request author is farmOwner or not
          (id == farmModel.farmOwner &&
            (await compareUserIdWithToken(
              bearerHeader,
              farmModel.farmOwner
            ))) ||
          //check if the request author is deleting theirself
          (id != farmModel.farmOwner &&
            (await compareUserIdWithToken(bearerHeader, id))) ||
          //check if the request author is the farmOwner
          //farmOwner can delete all
          //only farmOwner can delete theirself
          (await compareUserIdWithToken(bearerHeader, farmModel.farmOwner)) ||
          // check if the request author is techadmin
          (await onValidUserRole(req.header("Authorization"), [
            UserRole.TechAdmin,
          ]))
        ) {
          userModel.farmId = null;
          userModel.isOwner = false;
          await userModel.save();
          if (farmModel.farmerList != null)
            farmModel.farmerList.pull({ farmer: id });
          if (farmModel.farmOwner.equals(id)) farmModel.farmOwner = null;
          console.log("farmModel.farmOwner", farmModel.farmOwner);
          console.log("id", id);
          await farmModel.save();
          return res.status(200).send(await FarmModel.findById(farmModel._id));
        } else {
          return res
            .status(400)
            .send(onResponse(400, "Permission denied, please try again."));
        }
      } else {
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "Farmer does not join this farm, please check anh try again."
            )
          );
      }
    } catch (e) {
      res.status(500).send(onResponse(500, e.message));
    }
  },

  //
  // Send List Controller
  //
  removeSeedFromFarm: async (req, res) => {
    try {
      // check if seedId Exist
      const seed = await SeedModel.findById(req.query.seedId);
      if (seed == null)
        return res
          .status(400)
          .send(onResponse(400, "Seed Not Found" + ERROR_MESSAGE));

      const farm = await FarmModel.findOne({
        _id: req.params.id,
        "seedList.seed": req.query.seedId,
      });
      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Seed does not exist in Farm" + ERROR_MESSAGE));

      farm.seedList.pull({ seed: req.query.seedId });
      await farm.save();

      seed.farmId = null;
      seed.save();

      res.send(await FarmModel.findById(req.params.id));
    } catch (e) {
      res.status(500).send(onResponse(500, e.message));
    }
  },

  //
  // Land List Controller
  //
  removeLandFromFarm: async (req, res) => {
    try {
      // check if landId Exist
      const land = await LandModel.findById(req.query.landId);
      if (land == null)
        return res
          .status(400)
          .send(onResponse(400, "Land Not Found" + ERROR_MESSAGE));
      const farm = await FarmModel.findOne({
        _id: req.params.id,
        "landList.land": req.query.landId,
      });

      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Land does not exist in Farm" + ERROR_MESSAGE));

      farm.landList.pull({ land: req.query.landId });
      await farm.save();

      land.farmId = null;
      land.save();

      res.send(await FarmModel.findById(req.params.id));
    } catch (e) {
      res.status(500).send(onResponse(500, e.message));
    }
  },

  //
  // FarmProject List Controller
  //
  addFarmProjectIntoFarm: async (req, res) => {
    try {
      const farm = await FarmModel.findById(req.params.id);
      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Farm Not Found" + ERROR_MESSAGE));
      if (farm.farmProjectList == null) farm.farmProjectList = [];

      // check if seedId Exist
      const farmProject = await FarmProjectModel.findById(
        req.body.farmProjectId
      );
      if (!farmProject)
        return res
          .status(400)
          .send(onResponse(400, "FarmProject Not Found" + ERROR_MESSAGE));

      // check if seedId already been added to farm
      if (
        await FarmModel.findOne({
          _id: req.params.id,
          "farmProjectList.farmProject": req.body.farmProjectId,
        })
      )
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "Farm Project had already been added to farm" + ERROR_MESSAGE
            )
          );

      farm.farmProjectList = farm.farmProjectList.concat({
        farmProject: req.body.farmProjectId,
      });
      farmProject.farmId = farm._id;
      farmProject.save();
      await farm.save();

      res.send(farm);
    } catch (e) {
      res.status(500).send(onResponse(500, e.message));
    }
  },

  removeFarmProjectFromFarm: async (req, res) => {
    try {
      // check if farmProjectId Exist
      const farmProject = await FarmProjectModel.findById(
        req.query.farmProjectId
      );
      if (!farmProject)
        return res
          .status(400)
          .send(onResponse(400, "FarmProject Not Found" + ERROR_MESSAGE));

      const farm = await FarmModel.findOne({
        _id: req.params.id,
        "farmProjectList.farmProject": req.query.farmProjectId,
      });
      if (farm == null)
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "FarmProject does not exist in Farm" + ERROR_MESSAGE
            )
          );

      farm.farmProjectList.pull({ farmProject: req.query.farmProjectId });
      farmProject.farmId = null;
      farmProject.save();
      await farm.save();

      res.send(await FarmModel.findById(req.params.id));
    } catch (e) {
      res.status(500).send(onResponse(500, e.message));
    }
  },
  getAllFarmProjectInFarm: async (req, res) => {
    try {
      const { farmId } = req.params;

      const validFarm = await FarmModel.findOne({ farmId: farmId });

      if (!validFarm) {
        return res
          .status(400)
          .send(onError(400), "This farm doesn't exist" + ERROR_MESSAGE);
      }

      const farmProject = await FarmProjectModel.find({ farmId: farmId });

      return res.status(200).send(farmProject);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllFarmerInFarm: async (req, res) => {
    try {
      const { farmId } = req.params;

      const validFarm = await FarmModel.findById(farmId).populate({
        path: "farmerList",
        populate: {
          path: "farmer",
        },
      });

      if (!validFarm) {
        return res
          .status(400)
          .send(onError(400), "This farm doesn't exist" + ERROR_MESSAGE);
      }

      return res.status(200).send(validFarm.farmerList);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

const FarmServices = { farmController };

export default FarmServices;
