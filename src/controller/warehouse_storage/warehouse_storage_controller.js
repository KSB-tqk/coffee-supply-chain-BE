import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import { isValidWarehouseStateUpdate } from "../../helper/warehouse_storage/warehouse_storage_data_helper.js";
import User from "../../model/user/user.js";
import WarehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";

const warehouseStorageController = {
  addWarehouseStorage: async (req, res) => {
    try {
      const warehouseStorage = new WarehouseStorageModel(req.body);

      await warehouseStorage.save();

      res.status(200).send({
        msg: "Create warehouseStorage successfully",
        warehouseStorage,
      });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateWarehouseStorage: async (req, res) => {
    const id = req.params.id;

    const warehouseStorage = await WarehouseStorageModel.findById(id).exec();

    if (!warehouseStorage) {
      return res
        .status(400)
        .send(onError(400, "This warehouseStorage doesn't exist"));
    }

    WarehouseStorageModel.findOne(
      { _id: id },
      async function (err, warehouseStorage) {
        if (err) {
          res.status(422).send(onError(422, "Update transport failed"));
        } else {
          const oldState = warehouseStorage.state;

          //update fields
          if (warehouseStorage.state == 2)
            return res
              .status(400)
              .send(
                onError(
                  400,
                  "Warehouse Storage infomation cannot be update because it has been completed"
                )
              );

          for (var field in WarehouseStorageModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                warehouseStorage[field] = req.body[field];
              }
            }
          }

          if (req.body.state != null) {
            try {
              if (
                !(await isValidWarehouseStateUpdate(
                  warehouseStorage,
                  req.body.state,
                  oldState
                ))
              )
                return res
                  .status(400)
                  .send(onError(400, "Invalid State Update" + ERROR_MESSAGE));
            } catch (err) {
              return res.status(400).send(onError(400, err.message));
            }
          }
          if (warehouseStorage.state == 2) {
            warehouseStorage.outputDate = Date.now();
          }
          warehouseStorage.save();
          const warehousePop = await WarehouseStorageModel.findById(
            warehouseStorage._id
          )
            .populate("projectId")
            .populate("inspector");
          res.status(200).send({
            warehouse: warehousePop,
            contractContent:
              Date.now().toString() +
              "|" +
              warehouseStorage.inspector.toString() +
              "|Warehouse|" +
              warehouseStorage.state,
          });
        }
      }
    );
  },
  deleteWarehouseStorage: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouseStorage = await WarehouseStorageModel.findById(id).exec();

      if (!warehouseStorage) {
        return res
          .status(400)
          .send(onError(400, "This warehouseStorage doesn't exist"));
      }

      const warehouseStorageChangeState =
        await WarehouseStorageModel.findByIdAndRemove(id);
      warehouseStorageChangeState.state = 3;
      res.status(200).send({ msg: "Delete warehouseStorage success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllWarehouseStorages: async (req, res) => {
    try {
      const warehouseStorage = await WarehouseStorageModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();
      res.status(200).send(warehouseStorage.reverse());
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getWarehouseStorage: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouseStorage = await WarehouseStorageModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!warehouseStorage) {
        return res
          .status(400)
          .send(onError(400, "This warehouseStorage doesn't exist"));
      }

      res.status(200).send(warehouseStorage);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },

  addWarehouseStorageSupervision: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.query.email });
      const warehouseStorage = await WarehouseStorageModel.findById(
        req.query.warehouseStorageId
      );

      if (warehouseStorage == null)
        return res
          .status(404)
          .send(onError(404, "Warehouse Storage Not Found" + ERROR_MESSAGE));

      if (warehouseStorage.inspector != null) {
        return res
          .status(404)
          .send(
            onError(
              404,
              "Warehouse Storage already has an inspector" + ERROR_MESSAGE
            )
          );
      }

      if (user == null)
        return res
          .status(404)
          .send(
            onError(404, "Email does not link to any account" + ERROR_MESSAGE)
          );

      if (
        !(await onValidUserDepartment(user, [
          UserDepartment.WarehouseSupervision,
        ]))
      )
        return res
          .status(400)
          .send(
            onError(
              400,
              "User is not participate in this department" + ERROR_MESSAGE
            )
          );

      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      warehouseStorage.inspector = user._id;
      warehouseStorage.save();

      res.status(200).send(warehouseStorage);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  removeWarehouseStorageSupervision: async (req, res) => {
    try {
      const warehouseStorage = await WarehouseStorageModel.findById(
        req.query.warehouseStorageId
      );

      if (warehouseStorage == null)
        return res
          .status(404)
          .send(onError(404, "Warehouse Storage Not Found" + ERROR_MESSAGE));

      if (warehouseStorage.inspector == null) {
        return res
          .status(404)
          .send(
            onError(
              404,
              "Warehouse Storage does not has an inspector yet" + ERROR_MESSAGE
            )
          );
      }

      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      warehouseStorage.inspector = null;
      warehouseStorage.save();

      res.status(200).send(warehouseStorage);
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },
};

export default warehouseStorageController;
