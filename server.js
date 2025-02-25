const express = require("express");
const socket = require("socket.io");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.static("public"));

//Run the server
const server = app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});

console.log();

// setup sockets
const io = socket(server);

io.on("connection", (socket) => {
  console.log("Connected");
  socket.on("update", (data) => {
    console.log(data);
    socket.broadcast.emit("update", data);
  });
  socket.on("play", () => {
    socket.broadcast.emit("play");
  });
  socket.on("pause", () => {
    socket.broadcast.emit("pause");
  });
  socket.on("slider", (data) => {
    socket.broadcast.emit("slider", data);
  });
  socket.on("load", (data) => {
    socket.broadcast.emit("load", data);
  });
});
