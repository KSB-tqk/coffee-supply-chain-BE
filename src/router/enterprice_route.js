const express = require("express");
const Enterprise = require("../model/enterprice");
const router = express.Router();
const auth = require("../middleware/authentication");

router.post("/", auth, async (req, res) => {
  const enterprise = new Enterprise(req.body);

  try {
    await enterprise.save();
    res.status(201).send({ enterprise });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const enterprise = Enterprise.find();
    res.send(enterprise);
  } catch (e) {
    res.status(400).send(e);
  }
});
