process.env.TZ = "Europe/Kiev";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const init = require("./db/init");
const auth_router = require("./routers/auth");
const user_controller = require("./routers/user");
const functional_controller = require("./routers/function");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));
app.use(cookieParser());

app.use("/api", auth_router);
app.use("/api", user_controller);
app.use("/api", functional_controller);

const start = () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server listen on ${PORT} port.`);
    });
    init();
  } catch (e) {
    console.log(e);
  }
};

start();
