
angular.module('buttons',[])
    .controller('buttonCtrl',ButtonCtrl)
    .factory('buttonApi',buttonApi)
    .constant('apiUrl','http://localhost:1338'); //CHANGE for the lab!


function ButtonCtrl($q, $scope,buttonApi){
    $scope.buttons=[]; //Initially all was still
    $scope.errorMessage='';
    //functions
    $scope.isLoading=isLoading;
    $scope.crustSelect = crustSelect;
    $scope.cheeseSelect = cheeseSelect;
    $scope.sauceSelect = sauceSelect;
    $scope.gotoregister=gotoregister;
    $scope.register=register;
    $scope.login=login;
    $scope.getShit=getShit;
    $scope.toppingSelect = toppingSelect;
    $scope.addToCart = addToCart;
    $scope.addPizzaToCart = addPizzaToCart;
    $scope.refreshCart=refreshCart;
    $scope.getPrice = getPrice;
    $scope.refreshPizzaCart = refreshPizzaCart;
    //constants
    $scope.sizecrust="Choose your Crust";
    $scope.crusttype="";
    $scope.pizzaSize="";
    $scope.currentcheese="Choose your Cheese";
    $scope.currentsauce="Choose your Sauce";
    $scope.currenttopping = [];
    $scope.pizzaID = 1;
    $scope.newname="";
    $scope.newpassword="";
    $scope.newpassword1="";
    $scope.newmail="";
    $scope.newaddress="";
    $scope.newphone="";
    $scope.newcard="";
    $scope.username="snuffy";
    $scope.password="";
    $scope.meatArray=[];
    $scope.nonmeatArray=[];
    $scope.crustArray=[];
    $scope.sauceArray=[];
    $scope.drinksArray=[];
    $scope.sidesArray=[];
    $scope.drinksItemsInCart=[];
    $scope.sidesItemsInCart=[];
    $scope.pizzasInCart=[];
    $scope.totalPrices=[];
    $scope.toppingPrices=[];

    //$q.defer;




    var loading = false;


    function cheeseSelect(cheese){
       $scope.currentcheese = cheese;
    }
    function sauceSelect(sauce){
        $scope.currentsauce = sauce + " sauce";
    }

    function crustSelect(id){
        $scope.crusttype = id;
        $scope.pizzaSize = $scope.sizecrust.substring(0,4);

    }

    function gotoregister(){
        document.getElementsByClassName("loggedout")[0].setAttribute("style", "display:none;");
        document.getElementsByClassName("register")[0].setAttribute("style", "display:inline;");
    }

    function login(){

        buttonApi.login($scope.username,$scope.password)
            .success(function(data){
                $scope.currentUser=data;
                document.getElementsByClassName("loggedin")[0].setAttribute("style", "display:inline;");
                document.getElementsByClassName("loggedout")[0].setAttribute("style", "display:none;");
               // refreshTable();
            })
            .error(function(){$scope.errorMessage="Unable login";});
    }

    function register(){
    buttonApi.register($scope.newname, $scope.newpassword, $scope.newphone, $scope.newcard, $scope.newaddress, $scope.newmail)
        .success(function(){

            document.getElementsByClassName("loggedin")[0].setAttribute("style", "display:inline;");
            document.getElementsByClassName("register")[0].setAttribute("style", "display:none;");
            $scope.username = $scope.newname;
            $scope.password = $scope.newpassword;
            $scope.login();
        })
        .error(function(){scope.errorMessage="Unable login;"});
    }

    function isLoading(){
        return loading;
    }

    function getShit(){
        loading = true;
        buttonApi.getToppings()
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                    if(data[i].type == "meat"){
                        $scope.meatArray.push(data[i])
                    }
                    if(data[i].type == "nonmeat"){
                        $scope.nonmeatArray.push(data[i])
                    }
                    if(data[i].type == "crust"){
                        $scope.crustArray.push(data[i])
                    }
                }
                loading = false;
            }
        );

        buttonApi.getSauce()
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                        $scope.sauceArray.push(data[i])

                }
                loading = false;
            }
        );
        buttonApi.getDrank()
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                    $scope.drinksArray.push(data[i])

                }
                loading = false;
            }
        );
        buttonApi.getSide()
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                    $scope.sidesArray.push(data[i])

                }
                loading = false;
            }
        )
    }

    function toppingSelect(toppingName){

        $scope.currenttopping = [];
        angular.forEach($scope.meatArray, function(meat){
            if (meat.selected == true){
                $scope.currenttopping.push(meat.property);
            }
        });
        angular.forEach($scope.nonmeatArray, function(nonmeat){
            if (nonmeat.selected == true){
                $scope.currenttopping.push(nonmeat.property);
            }
        });
    }

    function refreshCart(){
        loading=true;
        $scope.drinksItemsInCart = [];
        $scope.sidesItemsInCart = [];
        buttonApi.getCart("Drinks")
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                    if((data[i].type == "drank")){
                        $scope.drinksItemsInCart.push(data[i]);
                    }
                }
                console.log($scope.drinksItemsInCart);
                loading=false;
            });
        buttonApi.getCart("sides")
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                    if((data[i].type == "side")){
                        $scope.sidesItemsInCart.push(data[i]);

                    }

                }
                console.log($scope.sidesItemsInCart);
                loading=false;
            });

    }

    function refreshPizzaCart(){
        loading=true;
        $scope.pizzasInCart = [];
        buttonApi.getPizzas()
            .success(function(pizzasInDB){
                //Do Stuff
                var tempId = pizzasInDB[0].pizzaID;
                var tempSize = pizzasInDB[0].type;
                var pizzaShell = {};
                pizzaShell.toppings = [];
                pizzaShell.prices = [];
                pizzaShell.crust = pizzasInDB[0].itemname + " " + pizzasInDB[0].type;
                for (i = 1; i<pizzasInDB.length; i++){

                    if(pizzasInDB[i].pizzaID == tempId){
                        if(pizzasInDB[i].type == "sauce"){
                            pizzaShell.sauce = pizzasInDB[i].itemname;
                        }
                        if(pizzasInDB[i].type == "cheese"){
                            pizzaShell.cheese = pizzasInDB[i].itemname;
                        }
                        if((pizzasInDB[i].type !="sauce") && (pizzasInDB[i].type !="cheese")){
                            pizzaShell.toppings.push(pizzasInDB[i].itemname);
                        }


                        //pizzaShell.sauce =

                    } else {
                        $scope.pizzasInCart.push(pizzaShell);
                        console.log($scope.pizzasInCart);

                        tempId = pizzasInDB[i].pizzaID;
                        tempSize = pizzasInDB[i].type;
                        pizzaShell= {};
                        pizzaShell.toppings = [];
                        pizzaShell.prices = [];
                        pizzaShell.crust = pizzasInDB[i].itemname + " " + pizzasInDB[i].type;
                        //pizzaShell.prices = getPrices(pizzasInDB[i].itemname, tempSize)

                    }


                }
                $scope.pizzasInCart.push(pizzaShell);

                //get prices
                var toppings = [];

                for (i = 0; i < $scope.pizzasInCart.length - 1; i++){


                    toppings = $scope.pizzasInCart[i].toppings;
                    for (i = 0; i<toppings.length; i++){

                    }


                }


                loading=false;
            });
    }

    function addToCart(itemname, itemtype, pizzaID) {
        buttonApi.addToCart(itemname, itemtype, pizzaID)
            .success(function(){
                if(pizzaID==0){
                    refreshCart();
                }


            })


    }
    function addPizzaToCart(){

        //Want to implement the below, need to figure how to import async

        //$scope.async.series([
        //   function(callback){
        //       addToCart($scope.crusttype, $scope.pizzaSize, $scope.pizzaID);
        //       callback();
        //   },
        //    function(callback){
        //        addToCart($scope.currentsauce, 'sauce', $scope.pizzaID);
        //        callback();
        //    },
        //    function(callback){
        //        addToCart($scope.currentcheese, 'cheese', $scope.pizzaID);
        //        callback();
        //    },
        //    function(callback){
        //        for (i = 0; i < $scope.currenttopping.length; i++){
        //            addToCart($scope.currenttopping[i], $scope.pizzaSize, $scope.pizzaID);
        //        }
        //    }
        //
        //]);

        addToCart($scope.crusttype, $scope.pizzaSize, $scope.pizzaID);
        addToCart($scope.currentsauce, 'sauce', $scope.pizzaID);
        addToCart($scope.currentcheese, 'cheese', $scope.pizzaID);
        for (i = 0; i < $scope.currenttopping.length; i++){
            addToCart($scope.currenttopping[i], $scope.pizzaSize, $scope.pizzaID);
        }
        $scope.pizzaID++;

        angular.forEach($scope.meatArray, function(meat) {
            meat.selected = false;
        });
        angular.forEach($scope.nonmeatArray, function(nonmeat) {
            nonmeat.selected = false;
        })
        $scope.currenttopping = [];
        refreshPizzaCart();

    }


    function getPrice(itemname, tablename){
        buttonApi.getPrice(itemname, tablename)
            .success(function(prices){
                console.log("getprice ");
                 $scope.pizzasInCart[x].prices =  prices;
            });
            //.error(function(){console.log("error")});
        //return defer.promise.$$state;
    }
    //console.log(getPrice("pan crust", "10in").$$state.value);

    function findLastPizzaID(){
        buttonApi.getPizzas()
            .success(function(data) {
                if (data.length == 0) {
                    $scope.pizzaID = 1;
                } else {


                $scope.pizzaID = data[data.length - 1].pizzaID + 1;
                }


            })
    }

    getShit();
    refreshCart();
    refreshPizzaCart();
    findLastPizzaID();



}





function buttonApi($http,apiUrl){
    return{
        getToppings: function(){
            var url = apiUrl+'/getToppings';
            return $http.get(url);
        },
        clickButton: function(id){
            var url = apiUrl+'/click?id='+id;
            return $http.get(url); // Easy enough to do this way
        },
        register: function(name, password, phone, card, address, mail){
            var url = apiUrl+'/register?name=' + name + '&password=' + password + '&phone=' + phone + '&card=' + card
                + '&address=' + address + '&mail=' + mail;
            return $http.get(url);
        },
        login: function(username, password){
            var url = apiUrl+'/login?username='+username+'&password='+password;
            return $http.get(url);
        },
        getPizzas: function(){
            var url = apiUrl+'/getPizzas';
            return $http.get(url);
        },
        getSauce: function(){
            var url = apiUrl+'/getSauce';
            return $http.get(url);
        },
        getDrank: function(){
            var url = apiUrl+'/getDrank';
            return $http.get(url);
        },
        getSide: function(){
            var url = apiUrl+'/getSide';
            return $http.get(url);
        },
        getCart: function(tablename){
            var url = apiUrl+'/getCart?tablename='+tablename;
            return $http.get(url);
        },
        addToCart: function(itemname, itemtype, pizzaID){
            var url = apiUrl+'/addToCart?itemname=' + itemname+'&itemtype=' +itemtype+'&pizzaID='+pizzaID;
            return $http.get(url);
        },
        getPrice: function(itemname, tablename){
            var url = apiUrl+'/getPrice?itemname=' + itemname+'&tablename='+tablename;
            return $http.get(url);
        }

    };
}