///////////////////////////////////////////////////////////////
// DEPENDENCIES
////////////////////////////////
// get .env variables
require("dotenv").config();
// pull PORT from .env, give default value of 3000
// pull MONGODB_URL from .env
const { PORT = 3000, DATABASE_URL } = process.env;
// import express
const express = require("express");
// create application object
const app = express();
// import mongoose
const mongoose = require("mongoose");
// import middlware
const cors = require("cors");
const morgan = require("morgan");

///////////////////////////////
// DATABASE CONNECTION
////////////////////////////////
// Establish Connection
mongoose.connect(DATABASE_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
// Connection Events
mongoose.connection
  .on("open", () => console.log("Your are connected to mongoose"))
  .on("close", () => console.log("Your are disconnected from mongoose"))
  .on("error", (error) => console.log(error));

///////////////////////////////
// MODELS
////////////////////////////////
const IceCreamsSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const IceCreams = mongoose.model("IceCreams", IceCreamsSchema);

///////////////////////////////
// MiddleWare
////////////////////////////////
app.use(cors()); // to prevent cors errors, open access to all origins
app.use(morgan("dev")); // logging
app.use(express.json()); // parse json bodies

///////////////////////////////
// ROUTES
////////////////////////////////
// create a test route
app.get("/", (req, res) => {
  res.send("I LOVE Ice Creams!");
});

// INDEX ROUTE
app.get("/icecreams", async (req, res) => {
    try {
      res.json(await IceCreams.find({}));
    } catch (error) {
      //send error
      res.status(400).json(error);
    }
  });

// Update ROUTE
app.put("/icecreams/:id", async (req, res) => {
    try {
      res.json(
        await IceCreams.findByIdAndUpdate(req.params.id, req.body, { new: true })
      );
    } catch (error) {
      res.status(400).json(error);
    }
  });
  
  // Delete ROUTE
  app.delete("/icecreams/:id", async (req, res) => {
    try {
      res.json(await IceCreams.findByIdAndRemove(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

// CREATE ROUTE
app.post("/icecreams", async (req, res) => {
  try {
    res.json(await IceCreams.create(req.body));
  } catch (error) {
    //send error
    res.status(400).json(error);
  }
});

// SHOW ROUTE
app.get("/icecreams/:id", async (req, res) => {
    try {
      res.json(await IceCreams.findById(req.params.id));
    } catch (error) {
      res.status(400).json(error);
    }
  });

///////////////////////////////
// LISTENER
////////////////////////////////
app.listen(PORT, () => console.log(`listening on PORT ${PORT}`));
