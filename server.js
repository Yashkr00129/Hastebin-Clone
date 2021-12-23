// Libraries
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Document = require("./models/document.js");

// Mongoose
mongoose
  .connect("mongodb://localhost/wastebin", {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Connected to MongoDB.."))
  .catch(() => console.log("Connection to MongoDB failed.."));

// Middleware
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// Routes

// Homepage Route
app.get("/", (req, res) => {
  const code = `Welcome to WasteBin!

Use the commands in the top right corner
to create a new file to share with others.`;
  res.render("code-display", {
    code,
    language: "plaintext",
    canSave: false,
  });
});

// New File Route
app.get("/new", (req, res) => {
  res.render("New", { canSave: true });
});
app.post("/save", async (req, res) => {
  const value = req.body.value;
  try {
    const document = await Document.create({ value });
    res.redirect(`/${document.id}`);
  } catch (e) {
    res.render("new", { value });
  }
});

// New File Display
app.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const document = await Document.findById(id);
    res.render("code-display", { code: await document.value });
  } catch (error) {
    res.redirect("/");
    console.log(error);
  }
});
// App Hosted On Port 3000
const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(`Server running at http://localhost:${port}`)
);