import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";

const produceSupervisionController = {
  addProduceSupervision: async (req, res) => {
    try {
      const produceSupervision = new ProduceSupervisionModel(req.body);

      await produceSupervision.save();

      res
        .status(200)
        .json({
          msg: "Create produceSupervision successfully",
          produceSupervision,
        });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  updateProduceSupervision: async (req, res) => {
    const id = req.params.id;

    const produceSupervision = await ProduceSupervisionModel.findById(
      id
    ).exec();

    if (!produceSupervision) {
      return res
        .status(400)
        .json({ msg: "This produceSupervision doesn't exist" });
    }

    ProduceSupervisionModel.findOne(
      { _id: id },
      function (err, produceSupervision) {
        if (err) {
          res.send(422, "Update transport failed");
        } else {
          //update fields
          for (var field in ProduceSupervisionModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                produceSupervision[field] = req.body[field];
              }
            }
          }
          produceSupervision.save();
          res.status(200).send({ produceSupervision });
        }
      }
    );
  },
  deleteProduceSupervision: async (req, res) => {
    try {
      const id = req.params.id;

      const produceSupervision = await ProduceSupervisionModel.findById(
        id
      ).exec();

      if (!produceSupervision) {
        return res
          .status(400)
          .json({ msg: "This produceSupervision doesn't exist" });
      }

      await ProduceSupervisionModel.findByIdAndRemove(id);
      res.status(200).json({ msg: "Delete produceSupervision success" });
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getAllProduceSupervisions: async (req, res) => {
    try {
      const produceSupervision = await ProduceSupervisionModel.find();
      res.status(200).json(produceSupervision);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
  getProduceSupervision: async (req, res) => {
    try {
      const id = req.params.id;

      const produceSupervision = await ProduceSupervisionModel.findById(
        id
      ).exec();

      if (!produceSupervision) {
        return res
          .status(400)
          .json({ msg: "This produceSupervision doesn't exist" });
      }

      res.status(200).json(produceSupervision);
    } catch (err) {
      res.status(400).json({ msg: err.message });
    }
  },
};

export default produceSupervisionController;
