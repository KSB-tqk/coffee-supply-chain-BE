import { ERROR_MESSAGE } from "../../enum/app_const.js";
import State from "../../enum/state.js";
import UserDepartment from "../../enum/user_department.js";
import UserRole from "../../enum/user_role.js";
import { onError, onValidUserRole } from "../../helper/data_helper.js";
import ProjectModel from "../../model/project/project.js";
import User from "../../model/user/user.js";
import FarmModel from "../../model/farm/farm.js";

const dashBoardController = {
  getDefaultInfo: async (req, res) => {
    try {
      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.TechAdmin,
          UserRole.SystemAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      const allProject = await ProjectModel.find({});
      const proccessingProject = allProject.filter(isProccessingStateProject);
      const completedProject = allProject.filter(isCompletedStateProject);
      const canceledProject = allProject.filter(isCancelStateProject);
      const notYetProject = allProject.filter(isNotYetStateProject);
      const pendingProject = allProject.filter(isPendingStateProject);

      const allUser = await User.find({});
      const systemAdmin = allUser.filter(isSystemAdmin);
      const techAdmin = allUser.filter(isTechAdmin);
      const farmer = allUser.filter(isFarmer);
      const staff = allUser.filter(isStaff);

      const harvestInspector = allUser.filter(isHarvestInspector);
      const produceSupervision = allUser.filter(isProduceSupervision);
      const transportInspector = allUser.filter(isTransportInpector);
      const warehouseInspector = allUser.filter(isWarehouseInspector);

      const allFarms = await FarmModel.find();

      res.send({
        numberOfProject: allProject.length,
        numberOfPendingProject: pendingProject.length,
        numberOfProccessingProject: proccessingProject.length,
        numberOfCompletedProject: completedProject.length,
        numberOfCanceledProject: canceledProject.length,
        numberOfNotYetProject: notYetProject.length,
        numberOfUser: allUser.length,
        numberOfSystemAdmin: systemAdmin.length,
        numberOfTechAdmin: techAdmin.length,
        numberOfFarmer: farmer.length,
        numberOfStaff: staff.length,
        numberOfHarvestInspector: harvestInspector.length,
        numberOfProduceSupervision: produceSupervision.length,
        numberOfTransportInspector: transportInspector.length,
        numberOfWarehouseInspector: warehouseInspector.length,
        numberOfFarms: allFarms.length,
      });
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },

  getProjectPerMonth: async (req, res) => {
    try {
      const listProjectPerMonth = [];
      for (let i = 0; i < 12; i++) {
        const listProject = await ProjectModel.find({
          $expr: { $eq: [{ $month: "$dateCreated" }, i + 1] },
        });
        listProjectPerMonth.push(listProject.length);
      }
      console.log(listProjectPerMonth);
      res.send({ data: listProjectPerMonth });
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },

  getSystemAdminDashBoardInfo: async (req, res) => {
    try {
      if (
        (await onValidUserRole(req.header("Authorization"), [
          UserRole.SystemAdmin,
          UserRole.TechAdmin,
        ])) == false
      )
        return res
          .status(400)
          .send(onError(400, "Unauthorized user" + ERROR_MESSAGE));

      const allUser = await User.find({});
      const staff = allUser.filter(isStaff);

      const nonDepartmentStaff = allUser.filter(isNonDepartmentStaff);
      const harvestInspector = allUser.filter(isHarvestInspector);
      const produceSupervision = allUser.filter(isProduceSupervision);
      const transportInspector = allUser.filter(isTransportInpector);
      const warehouseInspector = allUser.filter(isWarehouseInspector);

      res.send({
        numberOfUser: allUser.length,
        numberOfStaff: staff.length,
        numberOfNonDepartmentStaff: nonDepartmentStaff.length,
        numberOfHarvestInspector: harvestInspector.length,
        numberOfProduceSupervision: produceSupervision.length,
        numberOfTransportInspector: transportInspector.length,
        numberOfWarehouseInspector: warehouseInspector.length,
      });
    } catch (err) {
      return res.status(500).send(onError(500, err.message));
    }
  },
};

function isProccessingStateProject(project) {
  return project.state == State.Proccessing;
}
function isCompletedStateProject(project) {
  return project.state == State.Completed;
}
function isCancelStateProject(project) {
  return project.state == State.Canceled;
}
function isNotYetStateProject(project) {
  return project.state == State.NotYet;
}
function isPendingStateProject(project) {
  return project.state == State.Pending;
}

function isSystemAdmin(user) {
  return user.role == UserRole.SystemAdmin;
}
function isTechAdmin(user) {
  return user.role == UserRole.TechAdmin;
}
function isFarmer(user) {
  return user.role == UserRole.Farmer;
}
function isStaff(user) {
  return user.role == UserRole.Staff;
}

function isHarvestInspector(user) {
  return (
    user.department == UserDepartment.HarvestInspector &&
    user.role == UserRole.Staff
  );
}
function isProduceSupervision(user) {
  return (
    user.department == UserDepartment.SupervisingProduce &&
    user.role == UserRole.Staff
  );
}
function isTransportInpector(user) {
  return (
    user.department == UserDepartment.TransportSupervision &&
    user.role == UserRole.Staff
  );
}
function isWarehouseInspector(user) {
  return (
    user.department == UserDepartment.WarehouseSupervision &&
    user.role == UserRole.Staff
  );
}

function isNonDepartmentStaff(user) {
  return user.department == UserDepartment.Empty && user.role == UserRole.Staff;
}

export default dashBoardController;
