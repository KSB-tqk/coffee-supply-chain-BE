import express from "express";
import mongooseDB from "./database/mongoose.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const swaggerDocument = require("../src/swagger_v2.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import userRouter from "./router/user/user_route.js";
import farmRouter from "./router/farm/farm_router.js";
import FarmProjectRouter from "./router/farm/farm_project_router.js";
import harvestRouter from "./router/harvest/harvest_route.js";
import transportDriverRouter from "./router/transport/transport_driver_router.js";
import transportRouter from "./router/transport/transport_router.js";
import warehouseStorageRouter from "./router/warehouse_storage/warehouse_storage_router.js";
import warehouseRouter from "./router/warehouse/warehouse_router.js";
import produceSupervisionRouter from "./router/produce_supervision_router/produce_supervision_router.js";
import morgan from "morgan";
import projectRouter from "./router/project/project_router.js";
import { onError } from "./helper/data_helper.js";

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
app.use("/farm-project", FarmProjectRouter);
app.use("/harvest", harvestRouter);
app.use("/transport-driver", transportDriverRouter);
app.use("/transport", transportRouter);
app.use("/warehouse-storage", warehouseStorageRouter);
app.use("/warehouse", warehouseRouter);
app.use("/produce", produceSupervisionRouter);
app.use("/project", projectRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/:universalURL", (req, res) => {
  res.status(404).send(onError(404, "URL Not Found"));
});

const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

app.listen(port || 3000, () => {
  console.log("Server is up on port " + port);
});

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
