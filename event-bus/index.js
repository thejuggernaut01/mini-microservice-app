const { default: axios } = require("axios");
const express = require("express");

const app = express();

// app.use(bodyParser);
// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: "50mb", extended: true }));

const events = [];

app.get("/events", (req, res) => {
  res.send(events);
});

app.post("/events", async (req, res) => {
  // we assume whatever comes along in the request body is our event
  const event = req.body;

  events.push(event);

  await axios.post("http://posts-clusterip-srv:4000/events", event);
  await axios.post("http://comments-srv:4001/events", event);
  await axios.post("http://query-srv:4002/events", event);
  await axios.post("http://moderation-srv:4003/events", event);

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
