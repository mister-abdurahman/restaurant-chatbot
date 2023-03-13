const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const itemSchema = new Schema({
  id: ObjectId,
  name: String,
  price: Number,
  image: String,
});

module.exports = mongoose.model("Items", itemSchema);
