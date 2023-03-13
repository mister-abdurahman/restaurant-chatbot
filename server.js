const express = require("express");
const app = express();
require("./db").connectToMongoDB();
require("dotenv").config();
const itemDB = require("./model/itemSchema");
//
const PORT = process.env.PORT || 3000;
const http = require("http").Server(app); //binding our app to the http module

// attach http server to socket.io
const io = require("socket.io")(http);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const orderedItemsArray = [];
// create a new connection from the server side
io.on("connection", async (socket) => {
  console.log("A user connected");

  const database = await itemDB.find({});

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
  socket.on("items_to_order", (data) => {
    if (data === 1) {
      console.log(data);
      socket.emit("the_items_to_order", database);
    }
  });
  socket.on("items_ordered", (itemName) => {
    console.log(itemName);
    orderedItemsArray.push(itemName);
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

// STEPS:
// when you click 1., the list of items displays on the web, then you click on an item
// to add it to your cart, when an item is clicked, it should display "added to cart✔",
// also  the button 1. should be disabled after clicking it to list items for order

// when an item is clicked, it should be added to an array (savedItems) with its timestamp in the backend

// when a customer clicks 99, the items should disapper, a variable like "orderCompleted: true"
//  should be added to the items placed for order, and also show a nice message saying:
// "order completed!" or "no order to place" if theres no item in the array created as stated in [54]...
// and in this case, the option1. button should be enabled

// when a customer clicks 98, all items with the var "orderCompleted: true" should be displayed on the web

// when a customer clicks 97, items added to savedItems but without the "orderCompleted: true" should be displayed

// when a customer clicks 0, items added to savedItems but without the "orderCompleted: true" should be removed from the array
// if no order to remove, display "no order to cancel, press 1 to place an order"
