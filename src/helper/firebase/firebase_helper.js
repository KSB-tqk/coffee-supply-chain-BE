import admin from "firebase-admin";
import serviceJson from "./coffee-supply-chain-2c30f-firebase-adminsdk-v5jv0-726d131bf0.json" assert { type: "json" };

admin.initializeApp({
  credential: admin.credential.cert(serviceJson),
});

export default admin;
