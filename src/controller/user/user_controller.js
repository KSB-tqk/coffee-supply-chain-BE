import { json } from "express";
import User from "../../model/user/user.js";
import TechAdmin from "../../model/user/tech_admin.js";
import Farmer from "../../model/user/farmer.js";
import SystemAdmin from "../../model/user/system_admin.js";
import {
  checkValidObjectId,
  onError,
  onLogoutCurrentUser,
  onResponse,
  onValidUserRole,
} from "../../helper/data_helper.js";
import PermissionModel from "../../model/permission/permission.js";
import AccessModel from "../../model/permission/acesss.js";
import { checkValidUserInfo } from "../../helper/data_helper.js";
import validator from "validator";
import { ERROR_MESSAGE } from "../../enum/app_const.js";
import UserRole from "../../enum/user_role.js";
import Staff from "../../model/user/staff.js";
import { sendData } from "../../helper/blockchain_helper.js";

const userController = {
  addUser: async (req, res) => {
    try {
      var user;
      const isValidUserInfo = await checkValidUserInfo(req.body);
      console.log(isValidUserInfo);
      if (isValidUserInfo == null) {
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
            user = new Staff(req.body);
            break;
          default:
            user = new User(req.body);
        }

        // check if user is valid to create staff account
        if (
          user.role == UserRole.Staff &&
          !(await onValidUserRole(req.header("Authorization"), [
            UserRole.SystemAdmin,
            UserRole.TechAdmin,
          ]))
        )
          return res
            .status(400)
            .send(onError(400, "Permission denied" + ERROR_MESSAGE));

        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token });
      } else {
        res.status(400).send(onError(400, isValidUserInfo));
      }
    } catch (e) {
      res.status(400).send(onError(400, e.message));
    }
  },
  loginUser: async (req, res) => {
    try {
      if (!validator.isEmail(req.body.email)) {
        return res.status(400).send(onError(400, "Invalid Email Format"));
      }
      const user = await User.findByCredentials(
        req.body.email,
        req.body.password
      );
      const token = await user.generateAuthToken();
      res.send({ model: user, token });
    } catch (e) {
      res.status(400).send(onError(400, e.message));
    }
  },
  getAllUserInfo: async (req, res) => {
    try {
      const users = await User.find({}).populate({
        path: "farmList",
        populate: {
          path: "farm",
        },
      });
      res.send(users);
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
  getCurrentUserInfo: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate({
        path: "farmList",
        populate: {
          path: "farm",
        },
      });
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
  getUserById: async (req, res) => {
    const _id = req.params.id;

    try {
      if (!checkValidObjectId(_id)) {
        return res.status(400).send(onError(400, "Invalid User Id"));
      }
      const user = await User.findById(_id).populate({
        path: "farmList",
        populate: {
          path: "farm",
        },
      });
      if (!user) {
        res.status(400).send(onError(400, "User Not Found"));
      } else {
        res.send(user);
      }
    } catch (e) {
      res.status(500).send(onError(500, e.message));
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

    if (req.user.role == 1) {
      allowedUpdates.push("role");
    }

    if (
      await onValidUserRole(req.header("Authorization"), [
        UserRole.SystemAdmin,
        UserRole.TechAdmin,
      ])
    ) {
      allowedUpdates.push("department");
    }

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    console.log("allowed Update", allowedUpdates);

    if (!isValidOperation) {
      return res.status(400).send(onError(400, "Invalid updates"));
    }

    try {
      updates.forEach((update) => {
        req.user[update] = req.body[update];
      });

      await req.user.save();

      if (!req.user) {
        return res.status(404).send(onError(404, e.message));
      }
      res.send(req.user);
    } catch (e) {
      res.status(400).send(onError(400, e.message));
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

    if (
      await onValidUserRole(req.header("Authorization"), [
        UserRole.SystemAdmin,
        UserRole.TechAdmin,
      ])
    ) {
      allowedUpdates.push("department");
    }

    const isValidOperation = updates.every((update) =>
      allowedUpdates.includes(update)
    );

    console.log("allowed update", allowedUpdates);

    if (!isValidOperation) {
      return res.status(400).send(onError(400, "Invalid updates"));
    }

    try {
      if (!checkValidObjectId(req.params.id)) {
        return res.status(400).send(onError(400, "Invalid User Id"));
      }

      const user = await User.findById(req.params.id).populate({
        path: "farmList",
        populate: {
          path: "farm",
        },
      });

      if (!user) {
        return res.status(400).send(onError(400, "User Not Found"));
      }

      updates.forEach((update) => {
        user[update] = req.body[update];
      });

      await user.save();

      res.send(user);
    } catch (e) {
      res.status(400).send(onError(400, e.message));
    }
  },
  logoutCurrentUser: async (req, res) => {
    try {
      console.log(req.header("Authorization"));
      const result = await onLogoutCurrentUser(req.header("Authorization"));
      res.status(200).send(result);
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
  logoutAllUser: async (req, res) => {
    try {
      req.user.tokens = [];
      await req.user.save();

      res.send();
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
  deleteCurrentUser: async (req, res) => {
    try {
      await req.user.remove();
      res.send(req.user);
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
  deleteUserById: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.send(user);
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
  getUserByDepartmentId: async (req, res) => {
    const department = req.params.id;
    try {
      const users = await User.find({
        department: department,
        role: UserRole.Staff,
      })
        .populate({
          path: "farmList",
          populate: {
            path: "farm",
          },
        })
        .exec();

      res.send(users);
    } catch (e) {
      res.status(401).send(onError(401, e.message));
    }
  },
  getUserByRoleTypeId: async (req, res) => {
    const role = req.params.id;
    try {
      const users = await User.find({
        role: role,
      })
        .populate({
          path: "farmList",
          populate: {
            path: "farm",
          },
        })
        .exec();
      res.send(users);
    } catch (e) {
      res.status(401).send(onError(401, e.message));
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
        .populate({
          path: "farmList",
          populate: {
            path: "farm",
          },
        })
        .exec();
      res.send(users);
    } catch (e) {
      res.status(401).send(onError(401, e.message));
    }
  },
  getAllUserByFilter: async (req, res) => {
    try {
      const users = await User.find({
        role: { $ne: req.query.exceptRole },
      }).populate({
        path: "farmList",
        populate: {
          path: "farm",
        },
      });
      if (users != null) {
        return res.send(users);
      } else {
        res.status(404).send(onError(400, "User Not Found"));
      }
    } catch (e) {
      res.status(401).send(onError(401, e.message));
    }
  },
  updateUserPermission: async (req, res) => {
    try {
      const user = await User.findById(req.query.id);
      if (await User.exists({ _id: req.query.id })) {
        if (await PermissionModel.exists({ owner: req.query.id })) {
          console.log("User ID: " + user._id);
          const permission = await PermissionModel.findOne({ owner: user._id });

          if (permission.listProject == null) {
            permission.listProject = [];
          } else {
            const projectPermission = permission.listProject.find(
              (item) => req.query.projectId.str === item.projectId.str
            );
            const access = await AccessModel.findById(projectPermission.access);
            const accessItem = req.query.permissionId;
            if (
              access.listAccess.filter((item) => item.accessItem == accessItem)
                .length > 0
            )
              return res
                .status(400)
                .send(
                  onError(
                    400,
                    "User has already been granted this access, Please try again"
                  )
                );
            else {
              access.listAccess = access.listAccess.concat({ accessItem });
              access.save();
            }
          }
          res.status(200).send({ permission });
        } else {
          console.log("Create new");
          const access = new AccessModel({
            listAccess: [
              {
                accessItem: req.query.permissionId,
              },
            ],
          });
          access.save();
          const permission = new PermissionModel({
            owner: user._id,
            listProject: [
              {
                projectId: req.query.projectId,
                access: access._id,
              },
            ],
          });
          permission.save();
          res.status(200).send({ permission });
        }
      } else {
        return res.status(400).send(onError(400, "User Not Found"));
      }
    } catch (e) {
      res.status(400).send(onError(400, e.message));
    }
  },

  // Permission
  getUserPermissionById: async (req, res) => {
    const user = await User.findById(req.query.id);
    if (user != null) {
      const permission = await PermissionModel.findOne({
        owner: user._id,
      }).populate({
        path: "listProject",
        populate: {
          path: "access",
        },
      });

      // if (permission.listProject == null) {
      //   permission.listProject = [];
      // } else {
      //   const projectPermission = permission.listProject.find(
      //     (item) => req.query.projectId.str === item.projectId.str
      //   );
      //   // const access = await AccessModel.findById(projectPermission.access);
      //   // console.log(access);
      // }

      return res.status(200).send({ permission });
    } else {
      return res.status(404).send(onError(400, "User Not Found"));
    }
  },

  getUserByEmail: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.query.email }).populate({
        path: "listProject",
        populate: {
          path: "access",
        },
      });

      if (user == null)
        return res
          .status(400)
          .send(onError(400, "User Not Found" + ERROR_MESSAGE));

      res.send(user);
    } catch (e) {
      res.status(500).send(onError(500, e.message));
    }
  },
};

export default userController;
