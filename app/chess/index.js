
const express = require("express");
const app = express();

// Serve the "index.html" file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/mainpage.html");
});

app.get('/:id', (req, res) => {
  console.log(req.params.id);
  res.sendFile(__dirname + "/index.html");
});

// Serve picture files in the "pieces" folder
app.use("/pieces", express.static(__dirname + "/pieces"));
app.use("/game", express.static(__dirname + "/game"));

// Start the server and listen on port 5500
app.listen(5500, () => {
  console.log("Server started on port 5500");
});