const express = require("express");
const app = express();
const port = 8080;
const ExpressError = require("./ExpressError");

app.listen(port, () => {
  console.log("Server is listining on port 8080");
});

app.use((req, res, next) => {
  req.time = new Date(Date.now()).toString();
  console.log(req.time, req.method, req.hostname, req.path);
  return next();
});

app.use("/random", (req, res, next) => {
  console.log("World");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello welcome to middlewares testing ");
  console.log("Hello");
});

app.get("/random", (req, res) => {
  res.send("World is so beautifull");
});

app.get("/err", (req, res) => {
  abcd = djhsad;
});

app.use((err, req, res, next) => {
  console.log("-----------Error----------------");
  let { status = 500, message = "Some type of eror" } = err;
  res.status(status).send(message);
});
