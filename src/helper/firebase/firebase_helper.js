import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";

dotenv.config({ path: path.resolve(dirname + "/dev.env") });

import firebaseConfig from "./coffee-supply-chain-2c30f-firebase-adminsdk-v5jv0-7e64f6c9d7.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
});

export default admin;

//9bea460f1923ce5b055a3b35cc44b0f7b7bdc446
