import { ERROR_MESSAGE } from "../../enum/app_const.js";
import { onError } from "../../helper/data_helper.js";
import { isValidWarehouseStateUpdate } from "../../helper/warehouse_storage/warehouse_storage_data_helper.js";
import WarehouseModel from "../../model/warehouse/warehouse.js";

const warehouseController = {
  addWarehouse: async (req, res) => {
    try {
      const warehouse = new WarehouseModel(req.body);

      await warehouse.save();

      res.status(200).send({ msg: "Create warehouse successfully", warehouse });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateWarehouse: async (req, res) => {
    const id = req.params.id;

    const warehouse = await WarehouseModel.findById(id).exec();

    if (!warehouse) {
      return res.status(400).send(onError(400, "This warehouse doesn't exist"));
    }

    WarehouseModel.findOne({ _id: id }, async function (err, warehouse) {
      if (err) {
        res.status(422).send(onError(422, "Update Warehouse failed"));
      } else {
        const oldState = warehouse.state;

        //update fields
        for (var field in WarehouseModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              warehouse[field] = req.body[field];
            }
          }
        }

        await warehouse.save();
        res.status(200).send({ warehouse });
      }
    });
  },
  deleteWarehouse: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouse = await WarehouseModel.findById(id).exec();

      if (!warehouse) {
        return res
          .status(400)
          .send(onError(400, "This warehouse doesn't exist"));
      }

      await WarehouseModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete warehouse success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllWarehouses: async (req, res) => {
    try {
      const warehouse = await WarehouseModel.find();
      res.status(200).send(warehouse);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getWarehouse: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouse = await WarehouseModel.findById(id).exec();

      if (!warehouse) {
        return res
          .status(400)
          .send(onError(400, "This warehouse doesn't exist"));
      }

      res.status(200).send(warehouse);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

export default warehouseController;
