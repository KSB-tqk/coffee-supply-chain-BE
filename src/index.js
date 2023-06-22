import express from "express";
import mongooseDB from "./database/mongoose.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import admin from "./helper/firebase/firebase_helper.js";
const require = createRequire(import.meta.url);
const swaggerDocument = require("../src/swagger_v2.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import userRouter from "./router/user/user_route.js";
import farmRouter from "./router/farm/farm_router.js";
import FarmProjectRouter from "./router/farm/farm_project_router.js";
import harvestRouter from "./router/harvest/harvest_route.js";
import transportRouter from "./router/transport/transport_router.js";
import warehouseStorageRouter from "./router/warehouse_storage/warehouse_storage_router.js";
import warehouseRouter from "./router/warehouse/warehouse_router.js";
import produceSupervisionRouter from "./router/produce_supervision_router/produce_supervision_router.js";
import morgan from "morgan";
import projectRouter from "./router/project/project_router.js";
import { onError } from "./helper/data_helper.js";
import stepLogRouter from "./router/step_log/step_log_router.js";
import dashBoardRouter from "./router/dash_board/dash_board_router.js";
import transportCompanyRouter from "./router/transport/transport_company_router.js";
import factoryRouter from "./router/produce_supervision_router/factory_router.js";
import notificationRouter from "./router/notification/notification_router.js";
import productRouter from "./router/project/product_router.js";
import imageUploadRouter from "./router/image_upload/image_upload_router.js";
const app = express();

const port = process.env.PORT;
mongooseDB.then(() => console.log("Connect db success!"));

app.use(cors());
app.use(morgan("dev"));
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/users", userRouter);
app.use("/farm", farmRouter);
app.use("/fcm", notificationRouter);
app.use("/farm-project", FarmProjectRouter);
app.use("/harvest", harvestRouter);
app.use("/transport-company", transportCompanyRouter);
app.use("/transport", transportRouter);
app.use("/warehouse-storage", warehouseStorageRouter);
app.use("/warehouse", warehouseRouter);
app.use("/factory", factoryRouter);
app.use("/produce", produceSupervisionRouter);
app.use("/steplog", stepLogRouter);
app.use("/project", projectRouter);
app.use("/dashboard", dashBoardRouter);
app.use("/image", imageUploadRouter);
app.use("/product", productRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/cronjob", (req, res) => {
  res.status(200).send(onError(200, "Cron Job Success"));
});

app.get("/", async (req, res) => {
  let img = "";
  let qr =
    "data:image/png;base64,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";
  console.log(qr);
  img = `<image src= " ` + qr + `" />`;
  return res.send(img);
});

app.get("/:universalURL", (req, res) => {
  res.status(404).send(onError(404, "URL Not Found"));
});

const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

app.listen(port || 3001, () => {
  console.log("Server is up on port " + port);
});

import sgMail from "@sendgrid/mail";
import notificationController from "./controller/notification/notification_controller.js";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: "19521686@gm.uit.edu.vn", // Change to your recipient
  from: "no.reply.hkmedia@gmail.com", // Change to your verified sender
  subject: "Sending with SendGrid is Fun",
  text: "and easy to do anywhere, even with Node.js",
  html: "<strong>and easy to do anywhere, even with Node.js</strong>",
};

// import { sendData } from "./helper/blockchain_helper.js";
// await sendData();
//
//
// enable the below to test the sending email function
//--------------------
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log("Email sent");
//   })
//   .catch((error) => {
//     console.error(error);
//   });

/**
#!/bin/bash
exec > >(tee /var/log/user-data.log|logger -t user-data -s 2>/dev/console)2>&1
curl -fsSL https://deb.nodesource.com/setup_16.x | bash
apt-get install -y nodejs

apt update
apt install ruby-full
apt install wet -y 
wet https://aws-codedeploy-ap-south-1.s3.ap-northeast-1.amazonaws.com/latest/install
chmod+x./install
•/install auto > /tmp/logfile
service codedeploy-agent restart

echo "Create Code directory"
mkdir-p/home/ubuntu/Code/coffee-supply-chain

touch /etc/systemd/system/cf.service
bash -c 'cat <<EOT > /etc/systemd/system/cf.service
[Unit]
Description=CoffeeSupplyChain

[Service]
ExecStart=/usr/bin/node /home/ec2-user/coffee-supply-chain-BE/src/index.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=Coffee-Supply-Chain-BE
User=ec2-user
EnvironmentFile=/home/ec2-user/coffee-supply-chain-BE/config/dev.env

[Install]
WantedBy=multi-user.target
EOT'

systemctl enable cf.service
systemctl start cf.service

https://coffee-supply-chain-2.s3.ap-northeast-1.amazonaws.com/latest/install
wget https://aws-codedeploy-ap-northeast-1.s3.ap-northeast-1.amazonaws.com/latest/install
wget https://aws-codedeploy-ap-northeast-1.s3.amazonaws.com/releases/codedeploy-agent_1.0-1.1597_all.deb

aws ssm send-command \ 
    --document-name "AWS-ConfigureAWSPackage" \
    --instance-ids "i-0f99e0d3e30de7018" \
    --parameters '{"action":["Install"],"installationType":["Uninstall and reinstall"],"name":["AWS-ConfigureAWSPackage"]}'
*/
