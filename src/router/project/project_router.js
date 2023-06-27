import express from "express";
import projectController from "../../controller/project/project_controller.js";
import auth from "../../middleware/authentication.js";

const projectRouter = express.Router();

projectRouter.get("/without-token", projectController.getProjectWithoutToken);

projectRouter.get("/loglist", projectController.getProjectLogList);

projectRouter.use(auth);

projectRouter.post("/", projectController.addProject);

projectRouter.get("/by-month", projectController.getProjectByMonth);

projectRouter.get("/:id", projectController.getProject);

projectRouter.get("/", projectController.getAllProjects);

projectRouter.patch("/:id", projectController.updateProject);

projectRouter.delete("/:id", projectController.deleteProject);

export default projectRouter;
