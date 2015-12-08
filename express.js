
var express=require('express'),
    mysql=require('mysql'),
    credentials=require('./credentials.json'),
    app = express(),
    port =  1338;
    async = require('async');

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
    var sql = 'select property, type, false as selected from Josh.10in'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
        console.log(err);
        } else {
            res.send(rows);
        }
    })
});

app.get("/getSauce", function(req, res){
    var sql = 'select saucename from Josh.sauces'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

app.get("/getDrank", function(req, res){
    var sql = 'select property from Josh.Drinks'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

app.get("/getPizzas", function(req, res){
    var sql = 'select * from Josh.shoppingcartbase where pizzaID!=0'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

app.get("/getCart", function(req, res){
    var tablename = req.param('tablename')
    var sql = 'select * from Josh.shoppingcartbase left join Josh.' + tablename+ ' on Josh.'+ tablename + '.property = Josh.shoppingcartbase.itemname '
    connection.query(sql, function(err, rows, fields){
        console.log(sql)
        if(err){console.log("we have and error:");
            console.log(err);
        } else {
            console.log(rows);
            res.send(rows);
        }
    })

});

app.get("/addToCart", function(req, res){
    var itemname = req.param('itemname');
    var itemtype = req.param('itemtype');
    var pizzaID = req.param('pizzaID');
    var exists = false;
    async.series([
        function(callback){
            var sql = 'select * from Josh.shoppingcartbase where itemname ="' + itemname+'"';
            connection.query(sql, function(err, rows, fields){
                if(err){console.log("we have an error:");
                console.log("inselect" + sql);
                } else {
                    if(rows.length != 0){
                        exists = true;
                    }
                }
                callback();
            })
        },
        function (callback){
            if(exists && (pizzaID==0)){
                var sql = 'update Josh.shoppingcartbase set quantity = quantity + 1 where itemname = "' + itemname +'"';
            } else {
                var sql = 'insert into Josh.shoppingcartbase (itemname, quantity, pizzaID, type) values ("' + itemname + '", 1, '+  pizzaID +  ', "'+ itemtype+'")';
            }
            connection.query(sql, function(err, rows, fields){
                if(err){console.log("we have an error:");
                    console.log("in update" + sql);
                } else {
                    res.send(err)
                }
            })
        }
    ])
})

app.get("/deleteItem", function(req, res){
    var itemname = req.param('itemname');
    var pizzaID = req.param('pizzaID')
    if(pizzaID > 0){
        var sql = 'delete from Josh.shoppingcartbase where pizzaID = ' + pizzaID;
    } else {
        var sql = 'delete from Josh.shoppingcartbase where itemname = "' + itemname + '"'
    }
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("delete sucks");
        } else {
            res.send(err)
        }
    })
});

app.get("/getSide", function(req, res){
    var sql = 'select property from Josh.sides'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("we have and error:");
            console.log(err);
        } else {
            res.send(rows);
        }
    })
});

app.get("/getPrice", function(req, res){
    var itemname = req.param('itemname');
    var tablename = req.param('tablename');

    var sql = 'select Dominos, PizzaHut, PapaJohns, Caseys, HungryHowies, PizzaRanch from Josh.'+ tablename+' where property = "' + itemname + '"';
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("fucking error:");
        console.log(err)
        } else {
            res.send(rows[0])
        }
    })
})

app.get("/logout", function(req, res){
    var sql = 'truncate Josh.shoppingcartbase'
    connection.query(sql, function(err, rows, fields){
        if(err){console.log("fuck logout");
        console.log(err)
        } else {
            res.send(err)
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


    async.series([
        function(callback){
            var sql = 'select user from Josh.pizzaUsers where name=' + username;
            connection.query(sql, function(err,rows,fields){
                if(err){console.log("we have and error:");
                    console.log(err);
                } else {
                    if (rows.length != 0){
                        return;
                    }
                }

            })
        }


    ]);

    var sql = 'insert into Josh.pizzausers values ("' + username + '", "' + email + '", "' + password + '", "' +
        address + '", "' + phone + '", "' +  '", "'  + card + '")';
    connection.query(sql,  function(err, rows, fields){
        if(err){console.log("We have an error:");
            console.log(err);
        } else {
            console.log(rows);
        res.send(err);
        }
    })


});

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