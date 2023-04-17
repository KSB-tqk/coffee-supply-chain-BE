import { onError } from "../../helper/data_helper.js";
import TransportCompanyModel from "../../model/transport/transport_company.js";
const transportCompanyController = {
  addTransportCompany: async (req, res) => {
    try {
      const transportCompany = new TransportCompanyModel(req.body);

      await transportCompany.save();

      res.status(200).send({
        msg: "Create Transport Company successfully",
        transportCompany,
      });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  updateTransportCompany: async (req, res) => {
    const id = req.params.id;

    const harvest = await TransportCompanyModel.findById(id).exec();

    if (!harvest) {
      return res
        .status(400)
        .send(onError(400, "This Transport Company doesn't exist"));
    }

    TransportCompanyModel.findOne(
      { _id: req.params.id },
      function (err, transportCompany) {
        if (err) {
          res.send(422, "Update Transport Company failed");
        } else {
          //update fields
          for (var field in TransportCompanyModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                transportCompany[field] = req.body[field];
              }
            }
          }
          transportCompany.save();
          res.status(200).send({ transportCompany });
        }
      }
    );
  },
  deleteTransportCompany: async (req, res) => {
    try {
      const id = req.params.id;

      const harvest = await TransportCompanyModel.findById(id).exec();

      if (!harvest) {
        return res.status(400).send(onError(400, "This harvest doesn't exist"));
      }

      await TransportCompanyModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete Transport Company success" });
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getAllTransportCompany: async (req, res) => {
    try {
      const { id } = req.params;

      console.log(id);

      const lands = await TransportCompanyModel.find({ farmId: id }).exec();
      res.status(200).send(lands);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
  getTransportCompany: async (req, res) => {
    try {
      const id = req.params.id;

      const transportCompany = await TransportCompanyModel.findById(id).exec();

      if (!transportCompany) {
        return res
          .status(400)
          .send(onError(400, "This Transport Company doesn't exist"));
      }

      res.status(200).send(transportCompany);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

export default transportCompanyController;
