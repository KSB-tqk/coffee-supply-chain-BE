import express from "express";
import mongooseDB from "./database/mongoose.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../src/swagger.json" assert { type: "json" };

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import userRouter from "./router/user/user_route.js";
import farmRouter from "./router/Farm/farm_router.js";
import FarmProjectRouter from "./router/Farm/farm_project_router.js";
import harvestRouter from "./router/harvest/harvest_route.js";
import transportRouter from "./router/shipping/transport_router.js";
import shippingRouter from "./router/shipping/shipping_router.js";
import warehouseStorageRouter from "./router/warehouse_storage/warehouse_storage_router.js";
import warehouseRouter from "./router/warehouse/warehouse_router.js";
import produceSupervisionRouter from "./router/produce_supervision_router/produce_supervision_router.js";
import morgan from "morgan";

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
app.use("/transport", transportRouter);
app.use("/shipping", shippingRouter);
app.use("/warehouse-storage", warehouseStorageRouter);
app.use("/warehouse", warehouseRouter);
app.use("/produce", produceSupervisionRouter);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

app.listen(port || 3000, () => {
  console.log("Server is up on port " + port);
});
