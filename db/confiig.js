const mongoose = require("mongoose");

mongoose
  .connect("mongodb+srv://user:test123@cluster0.q8tzcgf.mongodb.net/e-commerce")
  .then(() => {
    console.log("Connected to e-commerce database on MongoDB Atlas!!");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB Atlas:", err);
  });
