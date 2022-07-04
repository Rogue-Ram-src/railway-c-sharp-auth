const express = require("express");
const app = express();
const http = require("http").Server(app);
const bodyParser = require("body-parser");
app.use(express.json());
app.use(express.static("views"));
const crypto = require("crypto");
const passhash = require("./passwords");
const mongoose = require("mongoose");
const userModel = require("./db/users");
const server = http.listen(8080, () => {
  console.log("listening on port: *8080");
});

mongoose.connect(
  `${process.env.dbstring}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.post("/create", async (req, res) => {
    console.log(req.body)
  if ( req.body.authkey == process.env.authkey) {
    var random = null;
    random = passhash.random(30);
    passhash.create(random, (hash) => {
      let newData = new userModel({
        hash: hash,
      });
      newData.save();
      res.send(random)
    });
  }
});

app.post("/remove", async (req, res) => {
  console.log(req.body)
if ( req.body.authkey == process.env.authkey || req.body.key) {
  passhash.create(req.body.key, async (hash) => {
    const data = await userModel.findOne({
      hash: hash,
    });
    if(data){
      res.status(200)
      res.send(`Successfully deleted Key ${req.body.key}`)
      await userModel.findOneAndRemove({
        hash: hash
    })
    }
    else {
      res.status(400)
      res.send(`${req.body.key}, is a invalid key!`)
    }
  });
}
});

app.post("/auth", async (req, res) => {

  if (req.body.key) {
    passhash.create(req.body.key, async (hash) => {
      const data = await userModel.findOne({
        hash: hash,
      });
      if (data) {
        res.status(200);
        res.send("Auth Successful");
        return
      }
      else {
        res.status(200);
        res.send("Unauthorized");  
      }
    });
}
});
