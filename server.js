const express = require("express");
const app = express();
const path = require("path");

//
const http = require("http").Server(app); //binding our app to the http module

// attach http server to socket.io
const io = require("socket.io")(http);

// create a new connection from the server side

io.on("connection", (socket) => {
  //   console.log(socket.id);
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  //handling events coming from the client
  socket.on("message", (msg) => {
    console.log(`Client message: ${msg}`);
  });
  //   emmit event
  socket.emit("server-message", "This message is from the Server");
});

app.get("/", (req, res) => {
  //   res.json("route and server working");
//   res.sendFile(path.join(__dirname, "index.html"));
  res.sendFile(__dirname + "/index.html");
});

// running this, we are listening to the express server & we need to listen to the socket server
// app.listen(3000, () => {
//   console.log("Server running on 3000");
// });

//listening to the socket server now
http.listen(3000, () => {
  console.log("Server running on 3000");
});
