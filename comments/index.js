const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");

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

app.post("/posts/:id/comments", async (req, res) => {
  const commentId = randomBytes(4).toString("hex");

  const { content } = req.body;

  const comments = commentsByPostId[req.params.id] || [];

  comments.push({ id: commentId, content, status: "pending" });

  await axios.post("http://event-bus-srv:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      content,
      postId: req.params.id,
      status: "pending",
    },
  });

  res.status(201).send(comments);
});

app.post("/events", async (req, res) => {
  console.log("Received Event", req.body.type);

  const { type, data } = req.body;

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;

    try {
      await axios.post("http://event-bus-srv:4005/events", {
        type: "CommentUpdated",
        data: {
          id,
          status,
          postId,
          content,
        },
      });
    } catch (error) {
      console.log(error);
    }

    // console.log("PostId", postId);
    // console.log("comments", commentsByPostId);
    // const comments = commentsByPostId[postId];
    // console.log(comments);
    // const comment = comments?.find((comment) => comment.id === id);

    // if (comment) {
    //   comment.status = status;

    //   await axios.post("http://event-bus-srv:4005", {
    //     type: "CommentUpdated",
    //     data: {
    //       id,
    //       status,
    //       postId,
    //       content,
    //     },
    //   });
    // } else {
    //   console.log(`Comment with id ${id} not found.`);
    // }
  }

  res.send({});
});

app.listen(4001, () => {
  console.log("Listening on 4001");
});
