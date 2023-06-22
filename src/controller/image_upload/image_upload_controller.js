import { onError } from "../../helper/data_helper.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import path from "path";
import { promisify } from "util";
import { dirname } from "path";
import fs from "fs";
import { ERROR_MESSAGE } from "../../enum/app_const.js";
import ImageUploadModel from "../../model/image_upload/image_upload.js";

dotenv.config({ path: path.resolve(dirname + "/dev.env") });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const unlinkAsync = promisify(fs.unlink);

const imageUploadController = {
  uploadImage: async (req, res) => {
    try {
      let imageUploadInfo = null;
      await cloudinary.v2.uploader.upload(req.file.path).then((result) => {
        console.log(result);
        imageUploadInfo = ImageUploadModel(result);
        imageUploadInfo.publicId = result.public_id;
      });

      if (imageUploadInfo != null) {
        await imageUploadInfo.save();
        res.send(imageUploadInfo);
        // Delete the file like normal
        await unlinkAsync(req.file.path);
      } else {
        res
          .status(400)
          .send(onError(400, "Fail to upload and save image" + ERROR_MESSAGE));
      }
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },

  deleteImage: async (req, res) => {
    try {
      console.log(req.query.url);
      const imageUpload = await ImageUploadModel.findOne({
        url: req.query.url,
      });

      console.log(imageUpload);
      if (imageUpload == null) {
        return res
          .status(404)
          .send(onError(400, "Image Not Found" + ERROR_MESSAGE));
      }

      console.log(imageUpload.public_id);

      cloudinary.v2.uploader.destroy(imageUpload.public_id, function (result) {
        res.send("Delete Success");
      });

      await ImageUploadModel.findByIdAndRemove(imageUpload._id);
    } catch (err) {
      res.status(400).send(onError(400, err.message));
    }
  },
};

export default imageUploadController;
