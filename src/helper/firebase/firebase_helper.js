import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";

dotenv.config({ path: path.resolve(dirname + "/dev.env") });

import firebaseConfig from "./firebase-account-config.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export default admin;
