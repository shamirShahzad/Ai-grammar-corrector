import "dotenv/config";
import express from "express";
import path from "path";
import fetch from "node-fetch";

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

app.get("/", (req, resp) => {
  resp.render("index");
});

app.listen(port, () => {
  console.log(`Server Started at port:${port}`);
});
