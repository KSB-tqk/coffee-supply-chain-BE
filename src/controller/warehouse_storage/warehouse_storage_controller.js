import WarehouseStorageModel from "../../model/warehouse_storage/warehouse_storage.js";

const warehouseStorageController = {
  addWarehouseStorage: async (req, res) => {
    try {
      const warehouseStorage = new WarehouseStorageModel(req.body);

      await warehouseStorage.save();

      res.status(200).json({
        msg: "Create warehouseStorage successfully",
        warehouseStorage,
      });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  updateWarehouseStorage: async (req, res) => {
    const id = req.params.id;

    const warehouseStorage = await WarehouseStorageModel.findById(id).exec();

    if (!warehouseStorage) {
      return res
        .status(400)
        .json({ msg: "This warehouseStorage doesn't exist" });
    }

    WarehouseStorageModel.findOne(
      { _id: id },
      function (err, warehouseStorage) {
        if (err) {
          res.send(422, "Update transport failed");
        } else {
          //update fields
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
          .json({ msg: "This warehouseStorage doesn't exist" });
      }

      await WarehouseStorageModel.findByIdAndRemove(id);
      res.status(200).json({ msg: "Delete warehouseStorage success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getAllWarehouseStorages: async (req, res) => {
    try {
      const warehouseStorage = await WarehouseStorageModel.find();
      res.status(200).json(warehouseStorage);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getWarehouseStorage: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouseStorage = await WarehouseStorageModel.findById(id).exec();

      if (!warehouseStorage) {
        return res
          .status(400)
          .json({ msg: "This warehouseStorage doesn't exist" });
      }

      res.status(200).json(warehouseStorage);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};

export default warehouseStorageController;
