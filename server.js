const express = require("express");
const session = require("express-session");
const app = express();
const itemDB = require("./model/itemSchema");
require("./db").connectToMongoDB();
require("dotenv").config();

// mongodb session config
const MongoDBStore = require("connect-mongodb-session")(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_DB_URL_CONNECTION,
  collection: "mySessions",
});

// Catch errors
store.on("error", function (error) {
  console.log(error);
});

//
const PORT = process.env.PORT || 3000;
const http = require("http").Server(app); //binding our app to the http module

// Session config
const sessionMiddleware = session({
  secret: process.env.SECRET,
  resave: true,
  cookie: { maxAge: 10519200000 },
  store: store,
  saveUninitialized: true,
});

app.use(sessionMiddleware);

// attach http server to socket.io
const io = require("socket.io")(http);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// let orderedItemsArray = [];

// create a new connection from the server side
io.on("connection", async (socket) => {
  const req = socket.request.session;

  // const database = await itemDB.find({});
  // const dateObj = new Date();
  // const month = dateObj.getUTCMonth() + 1; //months from 1-12
  // const day = dateObj.getUTCDate();
  // const year = dateObj.getUTCFullYear();

  req.database = await itemDB.find({});
  req.orderedItemsArray = [];
  req.month = new Date().getUTCMonth() + 1;
  req.day = new Date().getUTCDate();
  req.year = new Date().getUTCFullYear();

  req.save();

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  socket.on("items_to_order", (data) => {
    if (data === 1) {
      console.log(data);
      // socket.emit("the_items_to_order", database);
      socket.emit("the_items_to_order", req.database);
    }
  });
  socket.on("items_ordered", (itemName) => {
    console.log(itemName);
    // orderedItemsArray.push({
    req.orderedItemsArray.push({
      name: itemName,
      // time: day + "/" + month + "/" + year,
      time: req.day + "/" + req.month + "/" + req.year,
      orderStatus: "added to cart",
    });
    req.save();
  });

  socket.on("completed_orders", (orderCompleted) => {
    // orderedItemsArray.forEach((element) => {
    req.orderedItemsArray.forEach((element) => {
      element.orderStatus = orderCompleted;
    });
    req.save();
    // socket.emit("ordered_items_array", orderedItemsArray);
    socket.emit("ordered_items_array", req.orderedItemsArray);
  });

  socket.on("generate_completed_orders", (aBoolean) => {
    // let newArr = new Array(...orderedItemsArray);
    req.newArr = new Array(...req.orderedItemsArray);
    req.save();
    // socket.emit("completed_orders_list", newArr);
    socket.emit("completed_orders_list", req.newArr);
    if (aBoolean === true) {
      req.newArr = [];
      aBoolean = false;
      req.save();
    }
  });

  socket.on("current_order", (currentOrder) => {
    socket.emit(
      "current_order_item",
      // orderedItemsArray[orderedItemsArray.length - 1]
      req.orderedItemsArray[req.orderedItemsArray.length - 1]
    );
    req.save();
  });

  socket.on("emit_to_cancel_order", (data) => {
    // const lastData = orderedItemsArray.pop();
    req.lastData = req.orderedItemsArray.pop();
    req.save();
    socket.emit("cancel_order", req.lastData);
  });
});

// running this, we are listening to the express server & we need to listen to the socket server
// app.listen(3000, () => {
//   console.log("Server running on 3000");
// });

//listening to the socket server now
http.listen(PORT, () => {
  console.log("Server running on 3000");
});
