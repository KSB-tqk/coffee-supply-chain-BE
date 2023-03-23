import { onError } from "../../helper/data_helper.js";
import TransportModel from "../../model/transport/transport.js";

const transportController = {
  addTransport: async (req, res) => {
    try {
      const transport = new TransportModel(req.body);

      transport.transportId = transport._id;
      await transport.save();

      res.status(200).send({ msg: "Create transport successfully", transport });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  updateTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id).exec();

      if (!transport) {
        return res
          .status(400)
          .send(onError(400, "This transport doesn't exist"));
      }

      TransportModel.findOne({ _id: id }, async function (err, transport) {
        if (err) {
          res.send(422, "Update transport failed");
        } else {
          //update fields
          if (transport.state == 2)
            return res.status(400).send({
              error:
                "Transport infomation cannot be update because it has been completed",
            });
          for (var field in TransportModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                transport[field] = req.body[field];
              }
            }
          }
          if (transport.state == 2) {
            transport.dateCompleted = Date.now();
          }
          transport.save();
          const transportPop = await TransportModel.findById(transport._id)
            .populate("projectId")
            .populate("inspector");
          res.status(200).send({
            transport: transportPop,
            contractContent:
              Date.now().toString() +
              "|" +
              transport.inspector.toString() +
              "|Transport|" +
              transport.state,
          });
        }
      });
    } catch (e) {
      res.status(500).send(onError(500, e.toString()));
    }
  },
  deleteTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id).exec();

      if (!transport) {
        return res
          .status(400)
          .send(onError(400, "This transport doesn't exist"));
      }

      const transportChangeState = await TransportModel.findById(id);
      transportChangeState.state = 3;
      transportChangeState.save();
      res.status(200).send({ msg: "Delete transport success" });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getAllTransport: async (req, res) => {
    try {
      const transport = await TransportModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();
      res.status(200).send(transport.reverse());
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!transport) {
        return res
          .status(400)
          .send(onError(400, "This transport doesn't exist"));
      }

      res.status(200).send(transport);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

export default transportController;
