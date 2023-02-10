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
      res.status(400).send({ msg: err.message });
    }
  },
  updateWarehouseStorage: async (req, res) => {
    const id = req.params.id;

    const warehouseStorage = await WarehouseStorageModel.findById(id).exec();

    if (!warehouseStorage) {
      return res
        .status(400)
        .send({ msg: "This warehouseStorage doesn't exist" });
    }

    WarehouseStorageModel.findOne(
      { _id: id },
      function (err, warehouseStorage) {
        if (err) {
          res.send(422, "Update transport failed");
        } else {
          //update fields
          if (warehouseStorage.state == 2)
            return res.status(400).send({
              error:
                "Warehouse Storage infomation cannot be update because it has been completed",
            });
          for (var field in WarehouseStorageModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                warehouseStorage[field] = req.body[field];
              }
            }
          }
          warehouseStorage.save();
          res.status(200).send({ warehouseStorage });
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
          .send({ msg: "This warehouseStorage doesn't exist" });
      }

      const warehouseStorageChangeState =
        await WarehouseStorageModel.findByIdAndRemove(id);
      warehouseStorageChangeState.state = 3;
      res.status(200).send({ msg: "Delete warehouseStorage success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllWarehouseStorages: async (req, res) => {
    try {
      const warehouseStorage = await WarehouseStorageModel.find()
        .populate("projectId")
        .populate("warehouse")
        .populate("inspector")
        .exec();
      res.status(200).send(warehouseStorage);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getWarehouseStorage: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouseStorage = await WarehouseStorageModel.findById(id)
        .populate("projectId")
        .populate("warehouse")
        .populate("inspector")
        .exec();

      if (!warehouseStorage) {
        return res
          .status(400)
          .send({ msg: "This warehouseStorage doesn't exist" });
      }

      res.status(200).send(warehouseStorage);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

export default warehouseStorageController;
