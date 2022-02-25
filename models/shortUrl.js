const mongoose = require("mongoose");
const { nanoid } = require("nanoid");
const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
    default: () => nanoid(5),
  },
  click: {
    type: Number,
    default: 0,
  },
});
module.exports = mongoose.model("shortUrl", shortUrlSchema);
