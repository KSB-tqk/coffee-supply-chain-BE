import express from "express";
import auth from "../../middleware/authentication.js";
import multer from "multer";
const upload = multer({ dest: "uploads/" });
import imageUploadController from "../../controller/image_upload/image_upload_controller.js";

const imageUploadRouter = express.Router();

imageUploadRouter.post(
  "/upload",
  upload.array("images", 4),
  imageUploadController.uploadImage
);

imageUploadRouter.delete("/", imageUploadController.deleteImage);

export default imageUploadRouter;
