import express from "express";
import mongooseDB from "./database/mongoose.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import userRouter from "./router/user/user_route.js";
import farmRouter from "./router/Farm/farm_router.js";
import FarmProjectRouter from "./router/Farm/farm_project_router.js";

const app = express();

const port = process.env.PORT;
mongooseDB.then(() => console.log("Connect db success!"));

app.use(cors());
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use("/users", userRouter);
app.use("/farm", farmRouter);
app.use("/farm-project", FarmProjectRouter);

const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
