import { onError } from "../../helper/data_helper.js";
import FactoryModel from "../../model/produce_supervision/factory.js";

const factoryController = {
  addFactory: async (req, res) => {
    try {
      const factory = new FactoryModel(req.body);

      factory.factoryId = factory._id;

      await factory.save();

      res.status(200).send({
        msg: "Create Factory successfully",
        factory,
      });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateFactory: async (req, res) => {
    const id = req.params.id;

    const factory = await FactoryModel.findById(id).exec();

    if (!factory) {
      return res.status(400).send(onError(400, "This Factory doesn't exist"));
    }

    FactoryModel.findOne({ _id: req.params.id }, function (err, factory) {
      if (err) {
        res.send(422, "Update Factory failed");
      } else {
        //update fields
        for (var field in FactoryModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              factory[field] = req.body[field];
            }
          }
        }
        factory.save();
        res.status(200).send({ factory });
      }
    });
  },
  deleteFactory: async (req, res) => {
    try {
      const id = req.params.id;

      const factory = await FactoryModel.findById(id).exec();

      if (!factory) {
        return res.status(400).send(onError(400, "This factory doesn't exist"));
      }

      await FactoryModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete Factory success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllFactory: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const factory = await FactoryModel.find({ farmId: id }).exec();
      res.status(200).send(factory);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getFactory: async (req, res) => {
    try {
      const id = req.params.id;

      const factory = await FactoryModel.findById(id).exec();

      if (!factory) {
        return res.status(400).send(onError(400, "This Factory doesn't exist"));
      }

      res.status(200).send(factory);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

export default factoryController;
