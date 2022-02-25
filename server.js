const express = require("express");
const mongoose = require("mongoose");
const ShortUrl = require("./models/shortUrl");
var methodOverride = require("method-override");
mongoose.connect("mongodb://localhost:27017/shortener");

const app = express();
app.set("view engine", "ejs");
app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const shortUrls = await ShortUrl.find();
  res.render("index", { shortUrls: shortUrls });
});
app.post("/shortUrls", async (req, res) => {
  await ShortUrl.create({ full: req.body.fullUrl });
  res.redirect("/");
});
app.get("/:shortUrl", async (req, res) => {
  const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
  if (shortUrl === null) return res.status(404);
  shortUrl.click++;
  shortUrl.save();
  res.redirect(shortUrl.full);
});
app.delete("/short/:shortUrl", findShort, async (req, res) => {
  try {
    console.log("clicked!");
    await res.shortUrl.remove();
    res.redirect("/");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.listen(process.env.PORT || 4000, () => {
  console.log(`Server running at port ${process.env.PORT || 4000}`);
});

async function findShort(req, res, next) {
  let shortUrl;
  try {
    shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl === null) {
      return res.status(404).json({ message: "URL not found" });
    }
  } catch (err) {
    return res.status(501).json({ message: err.message });
  }
  res.shortUrl = shortUrl;
  next();
}
