const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");

const app = express();

// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.send(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const commentId = randomBytes(4).toString("hex");

  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content });

  res.status(201).send(comments);
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});