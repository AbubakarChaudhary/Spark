const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://spark:HBSzTzdc1HXtzfQ8@cluster0.q8tzcgf.mongodb.net/e-commerce"
  )
  .then(() => {
    console.log("Connected to e-commerce database on MongoDB Atlas!!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
