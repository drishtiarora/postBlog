var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = require('q').Promise;

var port= 3000;
app.use(cors({
  origin: 'http://localhost:4200'
}));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(__dirname +'/src'));

mongoose.connect('mongodb://localhost:27017/blogPost', function (err) {
    if (err) {
        console.log("Not connected to db" + err);
    }
    else {
        console.log("Successfully connected");
        app.listen(port, function () {
            console.log("Running on port" + port);
        });
    }
});


app.get('/' , (req,res)=>{
    res.sendFile(__dirname +'/src/index.html');
})
