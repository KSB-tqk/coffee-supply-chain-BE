import TransportModel from "../../model/shipping/transport.js";
const transportController = {
  addTransport: async (req, res) => {
    try {
      const transport = new TransportModel(req.body);

      await transport.save();

      res.status(200).send({ msg: "Create transport successfully", transport });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateTransport: async (req, res) => {
    const id = req.params.id;

    const harvest = await TransportModel.findById(id).exec();

    if (!harvest) {
      return res.status(400).send({ msg: "This transport doesn't exist" });
    }

    TransportModel.findOne({ _id: req.params.id }, function (err, transport) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        for (var field in TransportModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              transport[field] = req.body[field];
            }
          }
        }
        transport.save();
        res.status(200).send({ transport });
      }
    });
  },
  deleteTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await TransportModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).send({ msg: "This harvest doesn't exist" });
      }

      await TransportModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete transport success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllTransports: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const lands = await TransportModel.find({ farmId: id }).exec();
      res.status(200).send(lands);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getTransport: async (req, res) => {
    try {
      const id = req.params.id;

      const transport = await TransportModel.findById(id).exec();

      if (!transport) {
        return res.status(400).send({ msg: "This transport doesn't exist" });
      }

      res.status(200).send(transport);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

export default transportController;
