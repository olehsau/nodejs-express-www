var fs = require('fs');
var express = require('express');
//var bodyParser = require('body-parser');

const userFile = "users.json";

function readDatabase(cb) {
    fs.readFile(userFile, (err, data)=>{
        if(err) {
            cb('Plik userFile nie istnieje');
        } else {
            cb(undefined, JSON.parse(data.toString()));
        }
    })
}

function writeDatabase(users) {
    fs.writeFile(userFile, JSON.stringify(users), (err) =>{
        if(err)
            console.log("writeDatabase error: ", err)
    })
}

function addUser(last_name, first_name) {
    readDatabase((err, users) => {
        users.push({first_name: first_name, last_name: last_name});
        //console.log("addUser", users);
        writeDatabase(users);
    })
}


var app = express();

//var parser = bodyParser.urlencoded();

//app.use(parser);

app.use(express.urlencoded({extended: true})); 
app.use(express.json());

// returns all users
app.get('/user', function(req, res) {
    fs.readFile(userFile, (err,data)=>{
        if(err){
            console.log('GET users error');
            res.end(err);
        }
        else{
            console.log('GET users');
            res.end(data);
        }
    })
})

app.get('/add_user', function(req, res) {
    // adding to users.json
    addUser(req.query.last_name, req.query.first_name);
    // printing in console
    console.log('user '+req.query.last_name+' '+req.query.first_name+' added to database.');
})

app.get('/delete_all_users', function(req,res){
    fs.writeFile(userFile,"[]",(err) =>{
        console.log("deleted all users");
        res.end("successfully deleted all users");
        if(err)
            console.log("writeDatabase error: ", err)
    });
})

app.listen(8081);
console.log("server is listening");