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
var arr=[];
const mongoURI = "mongodb://127.0.0.1:27017/test";

mongoose
    .connect(mongoURI, { useNewUrlParser: true } )
    .then(() => db=mongoose.connection )
    .catch(err => console.log(err))
 
var Users = require("./routes/Users")

app.use("/users", Users)

/* app.post('/profile', ( req , res ) => { 
    console.log(req.body.current_id+ ">>>>>>>id")
const click = {name :req.body.name};
console.log(click); 
db.collection('clicks' ).save(click, (err , result )=>{ 
if(err) { 
return console.log(err); 
} 
console.log('click added to db'); 
res.sendStatus(200); 
}); 
});  */
app.post('/profile', (req, res, next) =>{
   
    console.log("req.body.name"+ req.body.name)
    arr.push(req.body.name)
    var newName = {
      name: arr
    }
   
    var id = req.body.current_id;
    console.log(objectId(id));
    db.collection('users').updateOne({"_id": objectId(id)}, {$set: newName},
   (err, result) =>{
       if(err){
           return console.log("serverjs 47", err)
    }
    console.log("name is updated", newName);
    res.sendStatus(200)
   })
})

app.listen(port, () => {
    console.log("Server is runing on port:" + port)
})