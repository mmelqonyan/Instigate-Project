var jwt_decode = require('jwt-decode');


var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var mongoose = require("mongoose");
var objectId = require('mongodb').ObjectID
var port = process.env.PORT || 5000


app.use(bodyParser.json());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })

)
let db;
var arr = [];
const mongoURI = "mongodb://127.0.0.1:27017/test";

mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(() => db = mongoose.connection)
    .catch(err => console.log(err))

var Users = require("./routes/Users")

app.use("/users", Users)

app.post('/profile', (req, res, next) => {
    arr.push(req.body.name.name)
    var newName = {
        data: req.body.name.name
    }
    const token = req.body.token;
    var current_id;
    if (token !== undefined) {
        const decoded = jwt_decode(token)
        current_id = decoded._id;
    }
    var id = current_id;
    db.collection('users').updateOne({ "_id": objectId(id) }, { $set: newName },
        (err, result) => {
            if (err) {
                return console.log("serverjs 47", err)
            }
            res.sendStatus(200)
        })
})
app.get('/profile', (req, res) => {
    const token = req.headers['token'];
    var current_id;
    if (token !== undefined) {
        const decoded = jwt_decode(token)
        current_id = decoded._id;
    }
    var id = current_id;
    db.collection('users').findOne({ "_id": objectId(id) }, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send({ "data": data });
    })
})

app.listen(port, () => {
    console.log("Server is runing on port:" + port)
})