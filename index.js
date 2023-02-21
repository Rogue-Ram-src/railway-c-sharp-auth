const express = require("express");
const app = express();
const http = require("http").Server(app);
const encryption = require("./encryption")
const validate = require("./validate")
const bodyParser = require("body-parser");
app.use(express.json());
app.use(express.static("views"));
const crypto = require("crypto");
const passhash = require("./passwords");
const mongoose = require("mongoose");
const userModel = require("./db/users");
const server = http.listen(process.env.PORT||8080, async ()  =>  {
  console.log("Auth server started");
});

mongoose.connect(
  `${process.env.dbstring}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.post("/create", async (req, res) => {
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
if ( req.body.authkey == process.env.authkey && req.body.key) {
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
  if(req.body && req.body.data){
    const body = await encryption.decrypt(req.body.data)
    if(await validate.validateRequestBody(body)){
      if (body.key) {
        const now =  new Date();
        passhash.create(body.key, async (hash) => {
          const data = await userModel.findOne({
            hash: hash,
          });
          if (data) {
            const response = await encryption.encrypt({"Text":"Authorized","Timestamp":now.toISOString()})
            res.status(200)
            res.send(response)
            return
          }
          else {
            const response = await encryption.encrypt({"Text":"Unauthorized","Timestamp":now.toISOString()})
            res.status(200)
            res.send(response)
          }
        });
    }
    }else{
      res.status(400)
      res.send("Invalid Request")
    }
  }else{
    res.status(400)
    res.send("Invalid Request")
  }
});
