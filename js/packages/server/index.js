const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const https = require('https');
const fs = require('fs');
const path = require("path");
const { generateArt, generatePremintArt } = require("./generate");
const app = express();

const port = process.env.PORT || 4040;
const baseUrl = '0.0.0.0';
const directory = './assets/temp/';

const httpsOptions = {
  key: fs.readFileSync("./cert/key.pem"),
  cert: fs.readFileSync("./cert/cert.pem")
};

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('assets/temp'));

app.post("/api/generate", (req, res) => {
  const result = generateArt();
  console.log('== generated => ', result.image);
  res.status(200).send({result});
})

app.post("/api/generate-premint", (req, res) => {
  let resData = [];
  for (let i = 0; i < 9; i++) {
    const result = generatePremintArt(i);
    console.log('== premint generated => ', result.image);
    resData.push(result);
  }
  res.status(200).send({result: resData});
})

app.post("/api/remove", (req, res) => {
  const file = req.body.name;
  if (file === undefined) res.status(404).send(false);
  else {
    console.log(file);
    fs.unlink(directory + file, (err, files) => {
        if(err) 
        {
          console.error(`== delete error => ${err} : ${file}`);
          res.status(404).send(false);
        }
        else {
          console.log('== deleted => ', file);
          res.status(200).send(true);
        }
    });
  }
})

https.createServer(httpsOptions, app).listen(port, baseUrl, () => {
  console.log("server is listening on port 4040");
});
