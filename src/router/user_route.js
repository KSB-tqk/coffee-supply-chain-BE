import express from "express";
import jwt from "jsonwebtoken";
import User from "../model/user.js"
import auth from "../middleware/authentication.js";

const UserRouter = express.Router();

UserRouter.post("/", async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.pwd);
    const token = await user.generateAuthToken();
    res.send({ user, token });
    console.log(user.toString(), token.toString());
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

UserRouter.get("/", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

UserRouter.get("/me", auth, async (req, res) => {
  res.send(req.user);
});

UserRouter.get("/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const user = await User.findById(_id);
    res.send(user);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

UserRouter.patch("/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "pwd", "age"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates" });
  }

  try {
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });

    await req.user.save();

    if (!req.user) {
      return res.status(404).send(e.toString());
    }
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e.toString());
  }
});

// router.delete('/users/:id', auth, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if(!user) {
//             return res.status(404).send()
//         }
//         res.send(user)
//     } catch(e) {
//         res.status(500).send(e)
//     }
// })

UserRouter.post("/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

UserRouter.post("/logoutall", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();

    res.send();
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

UserRouter.delete("/me", auth, async (req, res) => {
  try {
    await req.user.remove();
    res.send(req.user);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

export default UserRouter;
