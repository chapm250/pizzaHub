var express=require('express'),
    mysql=require('mysql'),
    credentials=require('./credentials.json'),
    app = express(),
    port = process.env.PORT || 1338;

credentials.host='ids'; //setup database credentials

var connection = mysql.createConnection(credentials); // setup the connection

connection.connect(function(err){if(err){console.log(error)}});

app.use(express.static(__dirname ));


app.get("/login",function(req,res){
    var username = req.param('username');
    var password = req.param('password');
    var sql = 'select * from Josh.pizzausers where name = "' + username + '"and password = "' + password + '"';
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("We have an error:");
            console.log(err);
        } else {
            console.log(rows);
            if(rows.length != 0) {
                currentUser=username;
                res.send(username);
            }
        }
    })});

app.get("/getToppings", function(req, res){
    var sql = 'select property, type from Josh.10in'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
        console.log(err);
        } else {
            res.send(rows);
        }
    })
})

app.get("/getSauce", function(req, res){
    var sql = 'select saucename from Josh.sauces'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
            console.log(err);
        } else {
            res.send(rows);
        }
    })
})

app.get("/register",function(req,res){
    var username = req.param('name');
    var password = req.param('password');
    var email = req.param('mail');
    var address = req.param('address');
    var phone = req.param('phone');
    var card = req.param('card');

    var sql = 'insert into Josh.pizzausers values ("' + username + '", "' + email + '", "' + password + '", "' +
        address + '", "' + phone + '", "' +  '", "'  + card + '")'
    console.log(sql);
    connection.query(sql,  function(err, rows, fields){
        if(err){console.log("We have an error:");
            console.log(err);
        } else {
            console.log(rows);
        res.send(err);
        }
    })});

app.get("/click",function(req,res){
    var id = req.param('id');
    var sql = 'YOUR SQL HERE'
    console.log("Attempting sql ->"+sql+"<-");

    connection.query(sql,(function(res){return function(err,rows,fields){
        if(err){console.log("We have an insertion error:");
            console.log(err);}
        res.send(err); // Let the upstream guy know how it went
    }})(res));
});

app.listen(port);