import EnterpriseModel from "../../model/enterprise/enterprise";

const enterpriseController = {
  addEnterprise: async (req, res) => {
    try {
      const enterprise = new EnterpriseModel(req.body);

      res
        .status(200)
        .send({ msg: "Create enterprise successfully", enterprise });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  updateEnterprise: async (req, res) => {
    const id = req.params.id;

    const enterprise = await EnterpriseModel.findById(id).exec();

    if (!enterprise) {
      return res.status(400).send({ msg: "This enterprise doesn't exist" });
    }
  },
  deleteEnterprise: async (req, res) => {
    try {
      const id = req.params.id;

      const enterprise = await EnterpriseModel.findById(id).exec();

      if (!enterprise) {
        return res.status(400).send({ msg: "This enterprise doesn't exist" });
      }

      const enterpriseChangeState = await EnterpriseModel.findById(id);
      enterpriseChangeState.state = 3;
      enterpriseChangeState.save();
      res.status(200).send({ msg: "Delete enterprise success" });
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getAllEnterprises: async (req, res) => {
    try {
      const enterprise = await EnterpriseModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();

      res.status(200).send(enterprise.reverse());
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
  getEnterprise: async (req, res) => {
    try {
      const id = req.params.id;

      const enterprise = await EnterpriseModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!enterprise) {
        return res.status(400).send({ msg: "This enterprise doesn't exist" });
      }

      res.status(200).send(enterprise);
    } catch (err) {
      res.status(400).send({ msg: err.message });
    }
  },
};

export default enterpriseController;
