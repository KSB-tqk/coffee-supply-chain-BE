import { BASE_TRANSACTION_URL, ERROR_MESSAGE } from "../../enum/app_const.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import {
  findDuplicates,
  onError,
  onValidUserDepartment,
  onValidUserRole,
} from "../../helper/data_helper.js";
import { isValidProduceStateUpdate } from "../../helper/produce/produce_data_helper.js";
import ProduceSupervisionModel from "../../model/produce_supervision/produce_supervision.js";
import User from "../../model/user/user.js";

const produceSupervisionController = {
  addProduceSupervision: async (req, res) => {
    try {
      const produceSupervision = new ProduceSupervisionModel(req.body);

      produceSupervision.produceSupervisionId = produceSupervision._id;

      await produceSupervision.save();

      res.status(200).send({
        msg: "Create produceSupervision successfully",
        produceSupervision,
      });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
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
        .send(onError(400, "This produceSupervision doesn't exist"));
    }

    ProduceSupervisionModel.findOne(
      { _id: id },
      async function (err, produceSupervision) {
        if (err) {
          res.send(422, "Update transport failed");
        } else {
          const oldState = produceSupervision.state;

          //update fields
          if (produceSupervision.state == 2)
            return res
              .status(400)
              .send(
                onError(
                  400,
                  "Produce Supervision infomation cannot be update because it has been completed"
                )
              );

          for (var field in ProduceSupervisionModel.schema.paths) {
            if (field !== "_id" && field !== "__v") {
              if (req.body[field] !== undefined) {
                produceSupervision[field] = req.body[field];
              }
            }
          }

          if (req.body.transactionList != null) {
            if (!findDuplicates(produceSupervision.transactionList))
              for (
                let i = 0;
                i < produceSupervision.transactionList.length;
                i++
              ) {
                if (
                  produceSupervision.transactionList[i].transactionUrl == null
                ) {
                  produceSupervision.transactionList[i].transactionUrl =
                    BASE_TRANSACTION_URL +
                    produceSupervision.transactionList[i].transactionId;
                }
              }
            else
              return res
                .status(400)
                .send(
                  onError(
                    400,
                    "Some transaction are duplicated" + ERROR_MESSAGE
                  )
                );
          }

          if (req.body.state != null) {
            try {
              if (
                !(await isValidProduceStateUpdate(
                  produceSupervision,
                  req.body.state,
                  oldState
                ))
              ) {
                return res
                  .status(400)
                  .send(onError(400, "Invalid State Update" + ERROR_MESSAGE));
              }
            } catch (err) {
              return res.status(400).send(onError(400, err.message));
            }
          }

          if (produceSupervision.state == 2) {
            produceSupervision.dateCompleted = Date.now();
          }
          await produceSupervision.save();
          const producePop = await ProduceSupervisionModel.findById(
            produceSupervision._id
          )
            .populate("projectId")
            .populate("inspector");
          res.status(200).send({
            produce: producePop,
          });
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
          .send(onError(400, "This produceSupervision doesn't exist"));
      }

      const produceChangeState = await ProduceSupervisionModel.findById(id);
      produceChangeState.state = 3;
      res.status(200).send({ msg: "Delete produceSupervision success" });
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getAllProduceSupervisions: async (req, res) => {
    try {
      const produceSupervision = await ProduceSupervisionModel.find()
        .populate("projectId")
        .populate("inspector")
        .exec();
      res.status(200).send(produceSupervision.reverse());
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
  getProduceSupervision: async (req, res) => {
    try {
      const id = req.params.id;

      const produceSupervision = await ProduceSupervisionModel.findById(id)
        .populate("projectId")
        .populate("inspector")
        .exec();

      if (!produceSupervision) {
        return res
          .status(400)
          .send(onError(400, "This produceSupervision doesn't exist"));
      }

      res.status(200).send(produceSupervision);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  addProduceSupervisionInspector: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.query.email });
      const produceSupervision = await ProduceSupervisionModel.findById(
        req.query.produceSupervisionId
      );

      if (produceSupervision == null)
        return res
          .status(404)
          .send(onError(404, "Produce Supervision Not Found" + ERROR_MESSAGE));

      if (produceSupervision.inspector != null) {
        const inspector = await User.findById(produceSupervision.inspector);
        if (inspector == null)
          return res
            .status(404)
            .send(
              onError(
                404,
                "Produce already has an inspector which does not exist in the database" +
                  ERROR_MESSAGE
              )
            );
        return res
          .status(404)
          .send(
            onError(
              404,
              "Produce Supervision already has an inspector" + ERROR_MESSAGE
            )
          );
      }

      if (user == null)
        return res
          .status(404)
          .send(
            onError(404, "Email does not link to any account" + ERROR_MESSAGE)
          );

      if (
        !(await onValidUserDepartment(user, [
          UserDepartment.SupervisingProduce,
        ]))
      )
        return res
          .status(400)
          .send(
            onError(
              400,
              "User is not participate in this department" + ERROR_MESSAGE
            )
          );

      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
          UserRole.TechAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      produceSupervision.inspector = user._id;
      produceSupervision.save();

      res.status(200).send(produceSupervision);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },

  removeProduceSupervision: async (req, res) => {
    try {
      const produceSupervision = await ProduceSupervisionModel.findById(
        req.query.produceSupervisionId
      );

      if (produceSupervision == null)
        return res
          .status(404)
          .send(onError(404, "Produce Supervision Not Found" + ERROR_MESSAGE));

      if (produceSupervision.inspector == null) {
        return res
          .status(404)
          .send(
            onError(
              404,
              "Produce Supervision does not has an inspector yet" +
                ERROR_MESSAGE
            )
          );
      }

      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
          UserRole.TechAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      produceSupervision.inspector = null;
      produceSupervision.save();

      res.status(200).send(produceSupervision);
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },

  getAllProduceByUserId: async (req, res) => {
    try {
      const user = await User.findById(req.query.userId);
      if (!user)
        return res
          .status(400)
          .send(onError(400, "User Not Found" + ERROR_MESSAGE));

      const produceList = await ProduceSupervisionModel.find({
        inspector: user._id,
      })
        .populate("projectId")
        .populate("inspector");

      if (!produceList)
        return res
          .status(404)
          .send(
            onError(
              404,
              "No produce storage was found contain this inspector" +
                ERROR_MESSAGE
            )
          );

      res.status(200).send(produceList);
    } catch (err) {
      res.status(500).send(onError(500, err.message));
    }
  },
};

export default produceSupervisionController;
