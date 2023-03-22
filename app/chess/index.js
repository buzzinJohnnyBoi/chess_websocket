// const http = require('http');
// const fs = require('fs');

// http.createServer(function (req, res) {
//     if(req.url == "/") {
//         fs.readFile('index.html', function(err, data) {
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.write(data);
//             return res.end();
//         });
//     }
//     if(req.url.includes == "/pieces") {
//         fs.readFile('index.html', function(err, data) {
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.write(data);
//             return res.end();
//         });
//     }
// }).listen(5500);
const express = require("express");
const app = express();

// Serve the "index.html" file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Serve picture files in the "pieces" folder
app.use("/pieces", express.static(__dirname + "/pieces"));
app.use("/game", express.static(__dirname + "/game"));

// Start the server and listen on port 5500
app.listen(5500, () => {
  console.log("Server started on port 5500");
});