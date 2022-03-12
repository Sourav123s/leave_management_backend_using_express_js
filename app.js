require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParse = require("body-parser");
const morgan = require("morgan");
const core = require("cors");
const compression = require("compression");
// const userRouter = require("./routes/allrouter");
const app = express();

const port = process.env.PORT || 3000;

app.use(compression());

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(core());
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", require("./routes"));

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "error404.html"));
});

app.listen(port, () => {
  console.log(`Lisient to the port no ${port}`);
});
