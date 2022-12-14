import ShippingModel from "../../model/shipping/shipping.js";

const shippingController = {
  addShipping: async (req, res) => {
    try {
      const shipping = new ShippingModel(req.body);

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

    ShippingModel.findOne({ _id: id }, function (err, shipping) {
      if (err) {
        res.send(422, "Update transport failed");
      } else {
        //update fields
        for (var field in ShippingModel.schema.paths) {
          if (field !== "_id" && field !== "__v") {
            if (req.body[field] !== undefined) {
              shipping[field] = req.body[field];
            }
          }
        }
        shipping.save();
        res.status(200).send({ shipping });
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

      await ShippingModel.findByIdAndRemove(id);
      res.status(200).send({ msg: "Delete shipping success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllShipping: async (req, res) => {
    try {
      const shipping = await ShippingModel.find();
      res.status(200).send(shipping);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getShipping: async (req, res) => {
    try {
      const id = req.params.id;

      const shipping = await ShippingModel.findById(id).exec();

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
