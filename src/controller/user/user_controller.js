import { json } from "express";
import User from "../../model/user/user.js";
import TechAdmin from "../../model/user/tech_admin.js";
import Farmer from "../../model/user/farmer.js";
import SystemAdmin from "../../model/user/system_admin.js";
import { checkValidObjectId } from "../../helper/data_helper.js";

const userController = {
  addUser: async (req, res) => {
    try {
      var user;
      switch (req.body.role) {
        case 1:
          user = new TechAdmin(req.body);
          break;
        case 2:
          user = new SystemAdmin(req.body);
          break;
        case 3:
          user = new Farmer(req.body);
          break;
        case 4:
          user = new User(req.body);
          break;
        default:
      }

      await user.save();
      const token = await user.generateAuthToken();
      res.status(201).send({ user, token });
    } catch (e) {
      res.status(400).send(e);
    }
  },
  loginUser: async (req, res) => {
    try {
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.generateAuthToken();
      res.send({ user, token });
      console.log(user.toString(), token.toString());
    } catch (e) {
      res.status(400).send({ Code: 400, message: "Failed", Error: e.message });
    }
  },
  getAllUserInfo: async (req, res) => {
    try {
      const users = await User.find({});
      res.send(users);
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
  getCurrentUserInfo: async (req, res) => {
    res.send(req.user);
  },
  getUserById: async (req, res) => {
    const _id = req.params.id;

    try {
      if (!checkValidObjectId(_id)) {
        console.log("bug here");
        return res.status(400).send({ error: "Invalid User Id" });
      }
      const user = await User.findById(_id);
      if (!user) {
        res.status(400).send({ error: "User Not Found" });
      } else res.send(user);
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
  updateCurrentUserInfo: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "password",
      "address",
    ];
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
  },
  updateUserInfoById: async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "email",
      "password",
      "address",
    ];

    if (req.user.role == 1) {
      allowedUpdates.push("role");
    }

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    if (!isValidOperation) {
      return res.status(400).send({ error: "Invalid updates" });
    }

    try {
      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send({ error: "Invalid User Id" });
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(400).send({ error: "User Not Found" });
      }

      updates.forEach((update) => {
        user[update] = req.body[update];
      });

      await user.save();

      res.send(user);
    } catch (e) {
      res.status(400).send(e.toString());
    }
  },
  logoutCurrentUser: async (req, res) => {
    try {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });

      await req.user.save();

      res.send();
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
  logoutAllUser: async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();

      res.send();
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
  deleteCurrentUser: async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
  deleteUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.send(user);
    } catch (e) {
      res.status(500).send(e.toString());
    }
  },
  getUserByDepartmentId: async (req, res) => {
    const department = req.params.id;
    try {
      const users = await User.find({
        department: department,
      }).exec();
      res.send(users);
    } catch (e) {
      res.status(401).send(e.toString());
    }
  },
  getUserByRoleTypeId: async (req, res) => {
    const role = req.params.id;
    try {
      const users = await User.find({
        role: role,
      }).exec();
      res.send(users);
    } catch (e) {
      res.status(401).send({ e });
    }
  },
  getListUserPaginate: async (req, res) => {
    const perPage = 2;
    const page = req.params.page;
    try {
      const users = await User.find()
        .limit(perPage)
        .skip(perPage * page)
        .sort({
          name: "asc",
        })
        .exec();
      res.send(users);
    } catch (e) {
      res.status(401).send({ e });
    }
  },
  getAllUserByFilter: async (req, res) => {
    try {
      const users = await User.find({ role: { $ne: req.query.exceptRole } });
      if (users != null) {
        return res.send(users);
      } else {
        res.status(404).send({ error: "User Not Found" });
      }
    } catch (e) {
      res.status(401).send({ e });
    }
  },
};

export default userController;
