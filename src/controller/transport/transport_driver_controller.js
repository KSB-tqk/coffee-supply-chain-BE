import { onError } from "../../helper/data_helper.js";
import TransportDriverModel from "../../model/transport/transport_driver.js";
const transportDriverController = {
  addTransport: async (req, res) => {
    try {
      const transportDriverDriver = new TransportDriverModel(req.body);

      await transportDriverDriver.save();

      res.status(200).send({
        msg: "Create Transport Driver successfully",
        transportDriverDriver,
      });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateTransport: async (req, res) => {
    const id = req.params.id;

    const harvest = await TransportDriverModel.findById(id).exec();

    if (!harvest) {
      return res
        .status(400)
        .send(onError(400, "This Transport Driver doesn't exist"));
    }

    TransportDriverModel.findOne(
      { _id: req.params.id },
      function (err, transportDriverDriver) {
        if (err) {
          res.send(422, "Update Transport Driver failed");
        } else {
          //update fields
          for (var field in TransportDriverModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                transportDriverDriver[field] = req.body[field];
              }
            }
          }
          transportDriverDriver.save();
          res.status(200).send({ transportDriverDriver });
        }
      }
    );
  },
  deleteTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await TransportDriverModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).send(onError(400, "This harvest doesn't exist"));
      }

      await TransportDriverModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete Transport Driver success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllTransports: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const lands = await TransportDriverModel.find({ farmId: id }).exec();
      res.status(200).send(lands);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transportDriverDriver = await TransportDriverModel.findById(
        id
      ).exec();

      if (!transportDriverDriver) {
        return res
          .status(400)
          .send(onError(400, "This Transport Driver doesn't exist"));
      }

      res.status(200).send(transportDriverDriver);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

export default transportDriverController;
