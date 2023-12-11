const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://spark:HBSzTzdc1HXtzfQ8@cluster0.q8tzcgf.mongodb.net/")
  .then(() => {
    console.log("Connected to MongoDB Atlas!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
