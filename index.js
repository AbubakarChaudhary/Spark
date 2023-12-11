const express = require("express");
const cors = require("cors");

require("./db/confiig");
const user = require("./db/user");
const product = require("./db/Product");
const Jwt = require("jsonwebtoken");
const jwtKey = "shaka";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  try {
    const users = new user(req.body);
    let result = await users.save();
    result = result.toObject(); //covert result into object
    delete result.password; //delete the password from the signup api
    if (result) {
      Jwt.sign({ result }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "something went wrong" });
        } else {
          res.send({ result, auth: token });
        }
      });
    } else {
      res.send("No Result Found");
    }
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  if (req.body.password && req.body.email) {
    const users = await user.findOne(req.body).select("-password");
    if (users) {
      Jwt.sign({ users }, jwtKey, { expiresIn: "2h" }, (err, token) => {
        if (err) {
          res.send({ result: "something went wrong" });
        } else {
          res.send({ users, auth: token });
        }
      });
    } else {
      res.send("No User Found");
    }
  } else {
    res.send("No Data Found");
  }
});

app.get("/products", verifyToken, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 3;

  try {
    const totalProducts = await product.countDocuments();
    const totalPages = Math.ceil(totalProducts / pageSize);

    const products = await product
      .find()
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      currentPage: page,
      pageSize,
      totalPages,
      totalProducts,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/add-product", verifyToken, async (req, res) => {
  try {
    const products = new product(req.body);
    let result = await products.save();
    res.send(result);
  } catch (error) {
    console.error("Error saving data to MongoDB:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/products/:id", verifyToken, async (req, res) => {
  try {
    const result = await product.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    console.error("Error deleting data from MongoDB:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/search-all/:key", verifyToken, async (req, res) => {
  try {
    const key = req.params.key;
    const isNumeric = !isNaN(key);

    const result = await product.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: new RegExp(key, "i") } },
            { category: { $regex: new RegExp(key, "i") } },
            { userId: { $regex: new RegExp(key, "i") } },
            {
              // Conditionally match price based on input key type
              price: isNumeric
                ? parseInt(key)
                : { $regex: new RegExp(key, "i") },
            },
          ],
        },
      },
    ]);

    if (result.length > 0) {
      res.send(result);
    } else {
      res.send("No data found");
    }
  } catch (error) {
    console.error("Error during search:", error);
    res.status(500).send("Internal Server Error");
  }
});

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];
    Jwt.verify(token, jwtKey, (err, valid) => {
      if (err) {
        res.status(401).send("Please Provide Valid Token");
      } else {
        next();
      }
    });
  } else {
    res.send("Token Verification Failed");
  }
}

app.listen(4000);
