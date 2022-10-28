const express = require("express");
require("./database/mongoose");
const User = require("./model/user");
const path = require("path");
const userRouter = require("./router/user_route");
const cors = require("cors");

const app = express();

const port = process.env.PORT;

// app.use((req, res, next) => {

//     res.status(503).send('Service are unavailable at the monment, Please try again later !')

// })

app.use(cors());
app.use(express.json());
app.use("/users", userRouter);

const publicDir = path.join(__dirname, "../public");

app.use(express.static(publicDir));

app.listen(port, () => {
  console.log("Server is up on port " + port);
});

// const main = async () => {
//     const user = await User.findById('62e2645afda0cdd7c4e38258')
//     await user.populate('tasks')
//     console.log(user.tasks)
// }

// main()
