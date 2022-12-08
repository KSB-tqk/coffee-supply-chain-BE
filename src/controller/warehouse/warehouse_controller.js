import WarehouseModel from "../../model/warehouse/warehouse.js";

const warehouseController = {
  addWarehouse: async (req, res) => {
    try {
      const warehouse = new WarehouseModel(req.body);

      await warehouse.save();

      res.status(200).send({ msg: "Create warehouse successfully", warehouse });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateWarehouse: async (req, res) => {
    const id = req.params.id;

    const warehouse = await WarehouseModel.findById(id).exec();

    if (!warehouse) {
      return res.status(400).send({ msg: "This warehouse doesn't exist" });
    }

    WarehouseModel.findOne({ _id: id }, function (err, warehouse) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        for (var field in WarehouseModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              warehouse[field] = req.body[field];
            }
          }
        }
        warehouse.save();
        res.status(200).send({ warehouse });
      }
    });
  },
  deleteWarehouse: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouse = await WarehouseModel.findById(id).exec();

      if (!warehouse) {
        return res.status(400).send({ msg: "This warehouse doesn't exist" });
      }

      await WarehouseModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete warehouse success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllWarehouses: async (req, res) => {
    try {
      const warehouse = await WarehouseModel.find();
      res.status(200).send(warehouse);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getWarehouse: async (req, res) => {
    try {
      const id = req.params.id;

      const warehouse = await WarehouseModel.findById(id).exec();

      if (!warehouse) {
        return res.status(400).send({ msg: "This warehouse doesn't exist" });
      }

      res.status(200).send(warehouse);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

export default warehouseController;
