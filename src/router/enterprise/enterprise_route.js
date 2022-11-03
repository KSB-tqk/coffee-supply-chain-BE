import express from "express";
import Enterprise from "../../model/enterprise.js";
import auth from "../../middleware/authentication.js";

const EnterpriseRouter = express.Router();

EnterpriseRouter.post("/", auth, async (req, res) => {
  const enterprise = new Enterprise(req.body);

  try {
    await enterprise.save();
    res.status(201).send({ enterprise });
  } catch (e) {
    res.status(400).send(e);
  }
});

EnterpriseRouter.get("/", auth, async (req, res) => {
  try {
    const enterprise = Enterprise.find();
    res.send(enterprise);
  } catch (e) {
    res.status(400).send(e);
  }
});

export default EnterpriseRouter;
