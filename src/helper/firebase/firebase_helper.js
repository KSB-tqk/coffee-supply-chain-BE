import admin from "firebase-admin";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";

dotenv.config({ path: path.resolve(dirname + "/dev.env") });

const obj = {
  type: process.env.type,
  project_id: process.env.project_id,
  private_key_id: process.env.private_key_id,
  private_key: process.env.private_key,
  client_email: process.env.client_email,
  client_id: process.env.client_email,
  auth_uri: process.env.auth_uri,
  token_uri: process.env.token_uri,
  auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.client_x509_cert_url,
  universe_domain: process.env.universe_domain,
};

admin.initializeApp({
  credential: admin.credential.cert(obj),
});

export default admin;

//9bea460f1923ce5b055a3b35cc44b0f7b7bdc446
