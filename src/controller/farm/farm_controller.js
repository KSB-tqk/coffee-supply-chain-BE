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
      const { farmCode, farmName, farmAddress, farmPhoneNumber, farmOwner } =
        req.body;

      const checkFarmCodeExist = await FarmModel.findOne({
        farmCode: farmCode,
      });
      const checkFarmOwnerExist = await User.findOne({ email: farmOwner });

      console.log(checkFarmOwnerExist._id.toString());

      if (checkFarmCodeExist) {
        res.status(400).send(onResponse(400, "Farm Code already exists"));
      } else if (!checkFarmOwnerExist) {
        res.status(400).send(onResponse(400, "User doesn't exist"));
      } else if (checkFarmOwnerExist.role !== 3) {
        res.status(400).send(onResponse(400, "User isn't a Farmer"));
      } else if (checkFarmOwnerExist.farmList.length > 0) {
        res
          .status(400)
          .send(
            onResponse(
              400,
              "User had already been set to be Owner of another farm" +
                ERROR_MESSAGE
            )
          );
      } else {
        const newFarm = new FarmModel({
          farmCode: farmCode,
          farmName: farmName,
          farmAddress: farmAddress,
          farmPhoneNumber: farmPhoneNumber,
          farmOwner: checkFarmOwnerExist._id.toString(),
        });

        newFarm.farmerList = [];
        newFarm.farmerList = newFarm.farmerList.concat({
          farmer: checkFarmOwnerExist._id,
        });
        if (checkFarmOwnerExist == null) checkFarmOwnerExist.farmList = [];

        checkFarmOwnerExist.farmList = checkFarmOwnerExist.farmList.concat({
          farm: newFarm._id,
        });
        checkFarmOwnerExist.save();
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
        })) || userModel.farmList.length > 0;

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
        await compareUserIdWithToken(
          req.header("Authorization"),
          farmModel.farmOwner
        )
      ) {
        if (userModel.farmList == null) userModel.farmList = [];

        userModel.farmList = userModel.farmList.concat({
          farm: farmModel._id,
        });
        userModel.save();
        farmModel.farmerList = farmModel.farmerList.concat({
          farmer: userModel._id,
        });

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

      const allowedUpdates = ["farmName", "farmAddress", "farmPhoneNumber"];

      const farm = await FarmModel.findById(req.params.id);

      if (!farm)
        return res.status(400).send(onResponse(400, "This farm doesn't exist"));
      else if (!farm.farmName || !farm.farmAddress || !farm.farmPhoneNumber) {
        return res
          .status(400)
          .send(onResponse(400, "Farm info can't be blank!"));
      }

      try {
        const result = await compareUserIdWithToken(
          req.header("Authorization"),
          farm.farmOwner
        );
        if (!result) {
          return res
            .status(400)
            .send(
              onResponse(400, "Unauthorized Farm Owner, please try again.")
            );
        } else {
          allowedUpdates.push("farmOwner");
        }
      } catch (err) {
        return res.status(400).send(onResponse(400, err.toString()));
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
        return res.status(400).send(onResponse(400, e.toString()));
      } else {
        return res.status(200).send({ msg: `Update farm success`, farm: farm });
      }
    } catch (err) {
      res.status(400).send(onResponse(400, err.toString()));
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
        .exec();
      if (!farm) return res.status(400).send(onResponse(400, "No exist farm"));

      res.status(200).send(farm);
    } catch (err) {
      res.status(400).send(onResponse(400, err.msg));
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
        console.log("id == farmModel.farmOwner", id == farmModel.farmOwner);
        console.log(
          "compare delete user with token",
          await compareUserIdWithToken(bearerHeader, id)
        );
        console.log(
          "compare user with farmer",
          await compareUserIdWithToken(bearerHeader, farmModel.farmOwner)
        );
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
          (await compareUserIdWithToken(bearerHeader, farmModel.farmOwner))
        ) {
          userModel.farmList.pull({ farm: farmModel._id });
          await userModel.save();
          farmModel.farmerList.pull({ farmer: id });
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
      res.status(500).send(onResponse(500, e.toString()));
    }
  },

  //
  // Send List Controller
  //
  addSeedIntoFarm: async (req, res) => {
    try {
      const farm = await FarmModel.findById(req.params.id);
      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Farm Not Found" + ERROR_MESSAGE));
      if (farm.seedList == null) farm.seedList = [];

      // check if seedId Exist
      if (!(await SeedModel.findById(req.body.seedId)))
        return res
          .status(400)
          .send(onResponse(400, "Seed Not Found" + ERROR_MESSAGE));

      // check if seedId already been added to farm
      if (
        await FarmModel.findOne({
          _id: req.params.id,
          "seedList.seed": req.body.seedId,
        })
      )
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "Seed had already been added to farm" + ERROR_MESSAGE
            )
          );

      farm.seedList = farm.seedList.concat({ seed: req.body.seedId });
      farm.save();

      res.send(farm);
    } catch (e) {
      res.status(500).send(onResponse(500, e.toString()));
    }
  },
  removeSeedFromFarm: async (req, res) => {
    try {
      const farm = await FarmModel.findOne({
        _id: req.params.id,
        "seedList.seed": req.body.seedId,
      });
      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Seed does not exist in Farm" + ERROR_MESSAGE));

      // check if seedId Exist
      if (!(await SeedModel.findById(req.body.seedId)))
        return res
          .status(400)
          .send(onResponse(400, "Seed Not Found" + ERROR_MESSAGE));

      farm.seedList.pull({ seed: req.body.seedId });
      await farm.save();

      res.send(await FarmModel.findById(req.params.id));
    } catch (e) {
      res.status(500).send(onResponse(500, e.toString()));
    }
  },

  //
  // Land List Controller
  //
  addLandIntoFarm: async (req, res) => {
    try {
      const farm = await FarmModel.findById(req.params.id);
      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Farm Not Found" + ERROR_MESSAGE));
      if (farm.landList == null) farm.landList = [];

      // check if landId Exist
      if (!(await LandModel.findById(req.body.landId)))
        return res
          .status(400)
          .send(onResponse(400, "Land Not Found" + ERROR_MESSAGE));

      // check if landId already been added to farm
      if (
        await FarmModel.findOne({
          _id: req.params.id,
          "landList.land": req.body.landId,
        })
      )
        return res
          .status(400)
          .send(
            onResponse(
              400,
              "Land had already been added to farm" + ERROR_MESSAGE
            )
          );

      farm.landList = farm.landList.concat({ land: req.body.landId });
      farm.save();

      res.send(farm);
    } catch (e) {
      res.status(500).send(onResponse(500, e.toString()));
    }
  },

  removeLandFromFarm: async (req, res) => {
    try {
      const farm = await FarmModel.findOne({
        _id: req.params.id,
        "landList.land": req.body.landId,
      });
      if (farm == null)
        return res
          .status(400)
          .send(onResponse(400, "Land does not exist in Farm" + ERROR_MESSAGE));

      // check if landId Exist
      if (!(await LandModel.findById(req.body.landId)))
        return res
          .status(400)
          .send(onResponse(400, "Land Not Found" + ERROR_MESSAGE));

      farm.landList.pull({ land: req.body.landId });
      await farm.save();

      res.send(await FarmModel.findById(req.params.id));
    } catch (e) {
      res.status(500).send(onResponse(500, e.toString()));
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
      res.status(500).send(onResponse(500, e.toString()));
    }
  },

  removeFarmProjectFromFarm: async (req, res) => {
    try {
      const farm = await FarmModel.findOne({
        _id: req.params.id,
        "farmProjectList.farmProject": req.body.farmProjectId,
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

      // check if farmProjectId Exist
      const farmProject = await FarmProjectModel.findById(
        req.body.farmProjectId
      );
      if (!farmProject)
        return res
          .status(400)
          .send(onResponse(400, "FarmProject Not Found" + ERROR_MESSAGE));

      farm.farmProjectList.pull({ farmProject: req.body.farmProjectId });
      farmProject.farmId = null;
      farmProject.save();
      await farm.save();

      res.send(await FarmModel.findById(req.params.id));
    } catch (e) {
      res.status(500).send(onResponse(500, e.toString()));
    }
  },
};

const FarmServices = { farmController };

export default FarmServices;
