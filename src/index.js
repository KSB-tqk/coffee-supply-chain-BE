import express from "express";
import mongooseDB from "./database/mongoose.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import admin from "./helper/firebase/firebase_helper.js";
import fs from "fs";
import https from "https";
import http from "http";
const require = createRequire(import.meta.url);
const swaggerDocument = require("../src/swagger_v2.json");

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import settingRouter from "./router/setting/setting_router.js";
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
const protocol = process.env.PROTOCOL;
const host = process.env.HOST;

mongooseDB.then(() => {
  console.log("Connect db success!");
  //createTransaction("testBlockId/", "TestBlockContent");
  // getTransactionReceipt(
  //   "0xac5b1e97b94a53622bcc75921e19d428cc9d164c5945710c57f80331f8cd0915"
  // );
});

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
app.use("/setting", settingRouter);
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.get("/cronjob", (req, res) => {
  res.status(200).send(onError(200, "Cron Job Success"));
});

app.get("/privacy-policy", async (req, res) => {
  let img = "";
  console.log("Connected to Privacy Policy");
  img = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width'>
      <title>Privacy Policy</title>
      <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
    </head>
    <body>
    <strong>Privacy Policy</strong> <p>
                  Khanh Tran, Hieu Nguyen built the HK Solution app as
                  a Free app. This SERVICE is provided by
                  Khanh Tran, Hieu Nguyen at no cost and is intended for use as
                  is.
                </p> <p>
                  This page is used to inform visitors regarding my
                  policies with the collection, use, and disclosure of Personal
                  Information if anyone decided to use my Service.
                </p> <p>
                  If you choose to use my Service, then you agree to
                  the collection and use of information in relation to this
                  policy. The Personal Information that I collect is
                  used for providing and improving the Service. I will not use or share your information with
                  anyone except as described in this Privacy Policy.
                </p> <p>
                  The terms used in this Privacy Policy have the same meanings
                  as in our Terms and Conditions, which are accessible at
                  HK Solution unless otherwise defined in this Privacy Policy.
                </p> <p><strong>Information Collection and Use</strong></p> <p>
                  For a better experience, while using our Service, I
                  may require you to provide us with certain personally
                  identifiable information, including but not limited to Username, password, email, phonenumber. The information that
                  I request will be retained on your device and is not collected by me in any way.
                </p> <div><p>
                    The app does use third-party services that may collect
                    information used to identify you.
                  </p> <p>
                    Link to the privacy policy of third-party service providers used
                    by the app
                  </p> <ul><li><a href="https://www.google.com/policies/privacy/" target="_blank" rel="noopener noreferrer">Google Play Services</a></li><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></ul></div> <p><strong>Log Data</strong></p> <p>
                  I want to inform you that whenever you
                  use my Service, in a case of an error in the app
                  I collect data and information (through third-party
                  products) on your phone called Log Data. This Log Data may
                  include information such as your device Internet Protocol
                  (“IP”) address, device name, operating system version, the
                  configuration of the app when utilizing my Service,
                  the time and date of your use of the Service, and other
                  statistics.
                </p> <p><strong>Cookies</strong></p> <p>
                  Cookies are files with a small amount of data that are
                  commonly used as anonymous unique identifiers. These are sent
                  to your browser from the websites that you visit and are
                  stored on your device's internal memory.
                </p> <p>
                  This Service does not use these “cookies” explicitly. However,
                  the app may use third-party code and libraries that use
                  “cookies” to collect information and improve their services.
                  You have the option to either accept or refuse these cookies
                  and know when a cookie is being sent to your device. If you
                  choose to refuse our cookies, you may not be able to use some
                  portions of this Service.
                </p> <p><strong>Service Providers</strong></p> <p>
                  I may employ third-party companies and
                  individuals due to the following reasons:
                </p> <ul><li>To facilitate our Service;</li> <li>To provide the Service on our behalf;</li> <li>To perform Service-related services; or</li> <li>To assist us in analyzing how our Service is used.</li></ul> <p>
                  I want to inform users of this Service
                  that these third parties have access to their Personal
                  Information. The reason is to perform the tasks assigned to
                  them on our behalf. However, they are obligated not to
                  disclose or use the information for any other purpose.
                </p> <p><strong>Security</strong></p> <p>
                  I value your trust in providing us your
                  Personal Information, thus we are striving to use commercially
                  acceptable means of protecting it. But remember that no method
                  of transmission over the internet, or method of electronic
                  storage is 100% secure and reliable, and I cannot
                  guarantee its absolute security.
                </p> <p><strong>Links to Other Sites</strong></p> <p>
                  This Service may contain links to other sites. If you click on
                  a third-party link, you will be directed to that site. Note
                  that these external sites are not operated by me.
                  Therefore, I strongly advise you to review the
                  Privacy Policy of these websites. I have
                  no control over and assume no responsibility for the content,
                  privacy policies, or practices of any third-party sites or
                  services.
                </p> <p><strong>Children’s Privacy</strong></p> <div><p>
                    These Services do not address anyone under the age of 13.
                    I do not knowingly collect personally
                    identifiable information from children under 13 years of age. In the case
                    I discover that a child under 13 has provided
                    me with personal information, I immediately
                    delete this from our servers. If you are a parent or guardian
                    and you are aware that your child has provided us with
                    personal information, please contact me so that
                    I will be able to do the necessary actions.
                  </p></div> <!----> <p><strong>Changes to This Privacy Policy</strong></p> <p>
                  I may update our Privacy Policy from
                  time to time. Thus, you are advised to review this page
                  periodically for any changes. I will
                  notify you of any changes by posting the new Privacy Policy on
                  this page.
                </p> <p>This policy is effective as of 2023-07-20</p> <p><strong>Contact Us</strong></p> <p>
                  If you have any questions or suggestions about my
                  Privacy Policy, do not hesitate to contact me at no.reply.hkmedia@gmail.com.
                  
    </body>
    </html>
      `;
  return res.send(img);
});

app.get("/term-of-use", async (req, res) => {
  let img = "";
  console.log("Term-of-use");
  img = `<!DOCTYPE html>
    <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width'>
      <title>Terms &amp; Conditions</title>
      <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
    </head>
    <body>
    <strong>Terms &amp; Conditions</strong> <p>
                  By downloading or using the app, these terms will
                  automatically apply to you – you should make sure therefore
                  that you read them carefully before using the app. You’re not
                  allowed to copy or modify the app, any part of the app, or
                  our trademarks in any way. You’re not allowed to attempt to
                  extract the source code of the app, and you also shouldn’t try
                  to translate the app into other languages or make derivative
                  versions. The app itself, and all the trademarks, copyright,
                  database rights, and other intellectual property rights related
                  to it, still belong to Khanh Tran, Hieu Nguyen.
                </p> <p>
                  Khanh Tran, Hieu Nguyen is committed to ensuring that the app is
                  as useful and efficient as possible. For that reason, we
                  reserve the right to make changes to the app or to charge for
                  its services, at any time and for any reason. We will never
                  charge you for the app or its services without making it very
                  clear to you exactly what you’re paying for.
                </p> <p>
                  The HK Solution app stores and processes personal data that
                  you have provided to us, to provide my
                  Service. It’s your responsibility to keep your phone and
                  access to the app secure. We therefore recommend that you do
                  not jailbreak or root your phone, which is the process of
                  removing software restrictions and limitations imposed by the
                  official operating system of your device. It could make your
                  phone vulnerable to malware/viruses/malicious programs,
                  compromise your phone’s security features and it could mean
                  that the HK Solution app won’t work properly or at all.
                </p> <div><p>
                    The app does use third-party services that declare their
                    Terms and Conditions.
                  </p> <p>
                    Link to Terms and Conditions of third-party service
                    providers used by the app
                  </p> <ul><li><a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">Google Play Services</a></li><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></ul></div> <p>
                  You should be aware that there are certain things that
                  Khanh Tran, Hieu Nguyen will not take responsibility for. Certain
                  functions of the app will require the app to have an active
                  internet connection. The connection can be Wi-Fi or provided
                  by your mobile network provider, but Khanh Tran, Hieu Nguyen
                  cannot take responsibility for the app not working at full
                  functionality if you don’t have access to Wi-Fi, and you don’t
                  have any of your data allowance left.
                </p> <p></p> <p>
                  If you’re using the app outside of an area with Wi-Fi, you
                  should remember that the terms of the agreement with your
                  mobile network provider will still apply. As a result, you may
                  be charged by your mobile provider for the cost of data for
                  the duration of the connection while accessing the app, or
                  other third-party charges. In using the app, you’re accepting
                  responsibility for any such charges, including roaming data
                  charges if you use the app outside of your home territory
                  (i.e. region or country) without turning off data roaming. If
                  you are not the bill payer for the device on which you’re
                  using the app, please be aware that we assume that you have
                  received permission from the bill payer for using the app.
                </p> <p>
                  Along the same lines, Khanh Tran, Hieu Nguyen cannot always take
                  responsibility for the way you use the app i.e. You need to
                  make sure that your device stays charged – if it runs out of
                  battery and you can’t turn it on to avail the Service,
                  Khanh Tran, Hieu Nguyen cannot accept responsibility.
                </p> <p>
                  With respect to Khanh Tran, Hieu Nguyen’s responsibility for your
                  use of the app, when you’re using the app, it’s important to
                  bear in mind that although we endeavor to ensure that it is
                  updated and correct at all times, we do rely on third parties
                  to provide information to us so that we can make it available
                  to you. Khanh Tran, Hieu Nguyen accepts no liability for any
                  loss, direct or indirect, you experience as a result of
                  relying wholly on this functionality of the app.
                </p> <p>
                  At some point, we may wish to update the app. The app is
                  currently available on Android – the requirements for the 
                  system(and for any additional systems we
                  decide to extend the availability of the app to) may change,
                  and you’ll need to download the updates if you want to keep
                  using the app. Khanh Tran, Hieu Nguyen does not promise that it
                  will always update the app so that it is relevant to you
                  and/or works with the Android version that you have
                  installed on your device. However, you promise to always
                  accept updates to the application when offered to you, We may
                  also wish to stop providing the app, and may terminate use of
                  it at any time without giving notice of termination to you.
                  Unless we tell you otherwise, upon any termination, (a) the
                  rights and licenses granted to you in these terms will end;
                  (b) you must stop using the app, and (if needed) delete it
                  from your device.
                </p> <p><strong>Changes to This Terms and Conditions</strong></p> <p>
                  I may update our Terms and Conditions
                  from time to time. Thus, you are advised to review this page
                  periodically for any changes. I will
                  notify you of any changes by posting the new Terms and
                  Conditions on this page.
                </p> <p>
                  These terms and conditions are effective as of 2023-07-20
                </p> <p><strong>Contact Us</strong></p> <p>
                  If you have any questions or suggestions about my
                  Terms and Conditions, do not hesitate to contact me
                  at no.reply.hkmedia@gmail.com.
    </body>
    </html>
      `;
  return res.send(img);
});

app.get("/", async (req, res) => {
  let img = "";
  let qr =
    "data:image/png;base64,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";
  console.log("Connected to QR Page");
  img = `<image src= " ` + qr + `" />`;
  return res.send(img);
});

app.get("/:universalURL", (req, res) => {
  res.status(404).send(onError(404, "URL Not Found"));
});

const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

// let server;

// // Start a development HTTPS server.
// if (protocol === "https") {
//   const { execSync } = require("child_process");
//   const execOptions = { encoding: "utf-8", windowsHide: true };
//   let key = "./src/certs/root.key";
//   let certificate = "./src/certs/root.crt";

//   if (!fs.existsSync(key) || !fs.existsSync(certificate)) {
//     try {
//       execSync("openssl version", execOptions);

//       execSync(
//         `openssl req -x509 -newkey rsa:2048 -keyout ./src/certs/root.key -out ${certificate} -days 365 -nodes -subj "/C=US/ST=Foo/L=Bar/O=Baz/CN=localhost"`,
//         execOptions
//       );
//       execSync(`openssl rsa -in ./src/certs/root.key -out ${key}`, execOptions);

//       execSync("rm ./src/certs/root.key", execOptions);
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const options = {
//     key: fs.readFileSync(key),
//     cert: fs.readFileSync(certificate),
//     passphrase: "password",
//   };

//   server = https.createServer(options, app);
// } else {
//   server = http.createServer(app);
// }

// function sendBootStatus(status) {
//   // don't send anything if we're not running in a fork
//   if (!process.send) {
//     console.log("here it go");
//     return;
//   }
//   console.log("here it go 3");
//   process.send({ boot: status });
// }

// server.listen({ port, host }, function () {
//   // Tell the parent process that Server has booted.
//   sendBootStatus("ready");
// });

// local
app.listen(port || 3001, () => {
  console.log("Server is up on port " + port);
});

// server
// const httpsOptions = {
//   key: fs.readFileSync("./certs/key.pem"),
//   cert: fs.readFileSync("./certs/cert.pem"),
// };
// const server = https.createServer(httpsOptions, app).listen(port, () => {
//   console.log("server running at " + port);
// });

// import sgMail from "@sendgrid/mail";
// import notificationController from "./controller/notification/notification_controller.js";
// import ProduceSupervisionModel from "./model/produce_supervision/produce_supervision.js";
// import {
//   getTransactionReceipt,
//   createTransaction,
// } from "./helper/blockchain_helper.js";
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: "19521686@gm.uit.edu.vn", // Change to your recipient
//   from: "no.reply.hkmedia@gmail.com", // Change to your verified sender
//   subject: "Sending with SendGrid is Fun",
//   text: "and easy to do anywhere, even with Node.js",
//   html: "<strong>and easy to do anywhere, even with Node.js</strong>",
// };

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
