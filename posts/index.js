const express = require("express");
const bodyParser = require("body-parser");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();

// app.use(bodyParser);
// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { title } = req.body;

  posts[id] = { id, title };
  console.log(posts);

  res.status(201).send(posts);
});

app.listen(4000, () => {
  console.log("Listening on 4000");
});
