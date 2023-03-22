import ShippingModel from "../../model/transport/transport.js";

const shippingController = {
  addShipping: async (req, res) => {
    try {
      const shipping = new ShippingModel(req.body);

      shipping.shippingId = shipping._id;
      await shipping.save();

      res.status(200).send({ msg: "Create shipping successfully", shipping });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateShipping: async (req, res) => {
    const id = req.params.id;

    const shipping = await ShippingModel.findById(id).exec();

    if (!shipping) {
      return res.status(400).send({ msg: "This shipping doesn't exist" });
    }

    ShippingModel.findOne({ _id: id }, async function (err, shipping) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        if (shipping.state == 2)
          return res.status(400).send({
            error:
              "Shipping infomation cannot be update because it has been completed",
          });
        for (var field in ShippingModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              shipping[field] = req.body[field];
            }
          }
        }
        if (shipping.state == 2) {
          shipping.dateCompleted = Date.now();
        }
        shipping.save();
        const shippingPop = await ShippingModel.findById(shipping._id)
          .populate("projectId")
          .populate("inspector");
        res.status(200).send({
          shipping: shippingPop,
          contractContent:
            Date.now().toString() +
            "|" +
            shipping.inspector.toString() +
            "|Shipping|" +
            shipping.state,
        });
      }
    });
  },
  deleteShipping: async (req, res) => {
    try {
      const id = req.params.id;

      const shipping = await ShippingModel.findById(id).exec();

      if (!shipping) {
        return res.status(400).send({ msg: "This shipping doesn't exist" });
      }

      const shippingChangeState = await ShippingModel.findById(id);
      shippingChangeState.state = 3;
      shippingChangeState.save();
      res.status(200).send({ msg: "Delete shipping success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllShipping: async (req, res) => {
    try {
      const shipping = await ShippingModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();
      res.status(200).send(shipping.reverse());
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getShipping: async (req, res) => {
    try {
      const id = req.params.id;

      const shipping = await ShippingModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!shipping) {
        return res.status(400).send({ msg: "This shipping doesn't exist" });
      }

      res.status(200).send(shipping);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

export default shippingController;