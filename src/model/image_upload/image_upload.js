import mongoose from "mongoose";

const imageUploadSchema = mongoose.Schema({
  asset_id: {
    type: String,
  },
  public_id: {
    type: String,
  },
  version: {
    type: Number,
  },
  version_id: {
    type: String,
  },
  signature: {
    type: String,
  },
  width: {
    type: Number,
  },
  height: {
    type: Number,
  },
  format: {
    type: String,
  },
  resource_type: {
    type: String,
  },
  created_at: {
    type: Date,
  },
  tags: {
    type: Array,
  },
  bytes: {
    type: Number,
  },
  type: {
    type: String,
  },
  etag: {
    type: String,
  },
  placeholder: {
    type: Boolean,
  },
  url: {
    type: String,
  },
  secure_url: {
    type: String,
  },
  folder: {
    type: String,
  },
  access_mode: {
    type: String,
  },
  original_filename: {
    type: String,
  },
  api_key: {
    type: String,
  },
});

const ImageUploadModel = mongoose.model("ImageUpload", imageUploadSchema);

export default ImageUploadModel;
