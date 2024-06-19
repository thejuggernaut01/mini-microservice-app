const { default: axios } = require("axios");
const express = require("express");

const app = express();

// app.use(bodyParser);
// Parse JSON bodies
app.use(express.json({ limit: "10kb" }));
// Parse URL-encoded bodies
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/events", async (req, res) => {
  // we assume whatever comes along in the request body
  // is our event
  const event = req.body;

  await axios.post("http://localhost:4000/events", event);
  await axios.post("http://localhost:4001/events", event);
  // await axios.post("http://localhost:4002/events", event);

  res.send({ status: "OK" });
});

app.listen(4005, () => {
  console.log("Listening on 4005");
});
