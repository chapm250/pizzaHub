
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
    $scope.addCrustToCart = addCrustToCart;
    $scope.refreshCart=refreshCart;
    $scope.getPrice = getPrice;
    $scope.checkOut = checkOut;
    $scope.refreshPizzaCart = refreshPizzaCart;
    $scope.deleteItem = deleteItem;
    $scope.logout = logout;
    //$scope.currentTotal = currentTotal;
    //constants
    $scope.sizecrust="14in thick crust";
    $scope.crusttype="thick crust";
    $scope.pizzaSize="14in";
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
    $scope.currenttoppingNic = [];
    $scope.crustArray=[];
    $scope.sauceArray=[];
    $scope.drinksArray=[];
    $scope.sidesArray=[];
    $scope.drinksItemsInCart=[];
    $scope.sidesItemsInCart=[];
    $scope.pizzasInCart=[];
    $scope.totalPrices=[0,0,0,0,0,0];
    $scope.dsTotalPrices=[0,0,0,0,0,0];
    $scope.currentPizzaPrices=[12.99,10.00,14.99,11.99,9.00,13.99];
    $scope.selection=[];





    //$q.defer;




    var loading = false;

    function logout(){
        buttonApi.logout()
            .success(function(){
                document.getElementsByClassName("loggedout")[0].setAttribute("style", "display:inline;");
                document.getElementsByClassName("loggedin")[0].setAttribute("style", "display:none;");
                $scope.currentUser = ""
            })
    }

    function cheeseSelect(cheese){
       $scope.currentcheese = cheese;
        console.log($scope.currentcheese);
    }
    function sauceSelect(sauce){
        $scope.currentsauce = sauce + " sauce";
        //updatePizzaSelection();
    }

    function crustSelect(id){
        $scope.crusttype = id;
        $scope.pizzaSize = $scope.sizecrust.substring(0,4);

        getSelectionPrices(id,$scope.pizzaSize,0);

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
                refreshCart();
                refreshPizzaCart()
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

    function toppingSelect(){

        counter = 1;
        $scope.currenttopping = [];
        $scope.currenttoppingNic = [];
        $scope.selection=[$scope.selection[0]];
        angular.forEach($scope.meatArray, function(meat){
            if (meat.selected == true){

                $scope.currenttopping.push({name: meat.property, id: counter});
                $scope.currenttoppingNic.push(meat.property);
                getSelectionPrices(meat.property, $scope.pizzaSize,counter);
                counter++;
            }
        });
        angular.forEach($scope.nonmeatArray, function(nonmeat){
            if (nonmeat.selected == true){
                $scope.currenttopping.push({name: nonmeat.property, id: counter});
                $scope.currenttoppingNic.push(nonmeat.property);
                getSelectionPrices(nonmeat.property, $scope.pizzaSize,counter);
                counter++;
            }
        });
        getSelectionPrices($scope.crusttype,$scope.pizzaSize,0);
        //updatePizzaSelection();
    }

    function deleteItem(itemname, pizzaID){
        buttonApi.deleteItem(itemname, pizzaID)
            .success(function(data){
                refreshCart();
                refreshPizzaCart();
        }
        )
    }

    function checkOut(){
        buttonApi.checkOut()
            .success(function(data) {
                refreshCart();
                refreshPizzaCart();
            })
    }

    function refreshCart(){
        loading=true;
        $scope.drinksItemsInCart = [];
        $scope.sidesItemsInCart = [];
        buttonApi.getCart("Drinks")
            .success(function(data){
                $scope.dsTotalPrices=[0,0,0,0,0,0];

                for(i = 0; i < data.length; i++) {
                    if((data[i].type == "drank")){
                        //////Maybe implement this later
                        //counter=0;
                        //angular.forEach(data[i], function(column){
                        //    if(counter >= 5){
                        //        $scope.totalPrices[counter-5] += column
                        //    }
                        //    counter++;
                        //})
                        if (data[i].Dominos == null) {
                            $scope.dsTotalPrices[0] += "N/A";
                        }
                        if (data[i].PizzaHut == null) {
                            $scope.dsTotalPrices[1] += "N/A";
                        }
                        if (data[i].PapaJohns == null) {
                            $scope.dsTotalPrices[2] += "N/A";
                        }
                        if (data[i].Caseys == null) {
                            $scope.dsTotalPrices[3] += "N/A";
                        }
                        if (data[i].HungryHowie == null) {
                            $scope.dsTotalPrices[4] += "N/A";
                        }
                        if (data[i].PizzaRanch == null) {
                            $scope.dsTotalPrices[5] += "N/A";
                        }
                        $scope.dsTotalPrices[0] += data[i].quantity*data[i].Dominos;
                        $scope.dsTotalPrices[1] += data[i].quantity*data[i].PizzaHut;
                        $scope.dsTotalPrices[2] += data[i].quantity*data[i].PapaJohns;
                        $scope.dsTotalPrices[3] += data[i].quantity*data[i].Caseys;
                        $scope.dsTotalPrices[4] += data[i].quantity*data[i].HungryHowie;
                        $scope.dsTotalPrices[5] += data[i].quantity*data[i].PizzaRanch;
                        $scope.drinksItemsInCart.push(data[i]);
                    }
                }
                loading=false;
            });
        buttonApi.getCart("sides")
            .success(function(data){
                //$scope.totalPrices=[0,0,0,0,0,0];

                for(i = 0; i < data.length; i++) {
                    if((data[i].type == "side")){
                        if (data[i].Dominos == null) {
                            $scope.dsTotalPrices[0] += "N/A";
                        }
                        if (data[i].PizzaHut == null) {
                            $scope.dsTotalPrices[1] += "N/A";
                        }
                        if (data[i].PapaJohns == null) {
                            $scope.dsTotalPrices[2] += "N/A";
                        }
                        if (data[i].Caseys == null) {
                            $scope.dsTotalPrices[3] += "N/A";
                        }
                        if (data[i].HungryHowie == null) {
                            $scope.dsTotalPrices[4] += "N/A";
                        }
                        if (data[i].PizzaRanch == null) {
                            $scope.dsTotalPrices[5] += "N/A";
                        }
                        $scope.dsTotalPrices[0] += data[i].quantity*data[i].Dominos;
                        $scope.dsTotalPrices[1] += data[i].quantity*data[i].PizzaHut;
                        $scope.dsTotalPrices[2] += data[i].quantity*data[i].PapaJohns;
                        $scope.dsTotalPrices[3] += data[i].quantity*data[i].Caseys;
                        $scope.dsTotalPrices[4] += data[i].quantity*data[i].HungryHowie;
                        $scope.dsTotalPrices[5] += data[i].quantity*data[i].PizzaRanch;
                        $scope.sidesItemsInCart.push(data[i]);

                    }

                }
                loading=false;
            });

    }

    function refreshPizzaCart(){

        loading=true;
        $scope.pizzasInCart = [];
        buttonApi.getPizzas()
            .success(function(pizzasInDB){
                //Do Stuff
                $scope.totalPrices=[0,0,0,0,0,0];
                for(i = 0; i < 6; i++){
                    $scope.totalPrices[i]+=$scope.dsTotalPrices[i];
                }
                if (pizzasInDB.length != 0) {
                    var tempId = pizzasInDB[0].pizzaID;
                    var tempSize = pizzasInDB[0].type;
                    var pizzaShell = {};
                    pizzaShell.toppings = [];
                    pizzaShell.prices = [0, 0, 0, 0, 0, 0];
                    pizzaShell.crust = pizzasInDB[0].itemname;
                    pizzaShell.pizzaID = tempId;
                    pizzaShell.size = tempSize;
                    for (i = 1; i < pizzasInDB.length; i++) {

                        if (pizzasInDB[i].pizzaID == tempId) {
                            if (pizzasInDB[i].type == "sauce") {
                                pizzaShell.sauce = pizzasInDB[i].itemname;
                            }
                            if (pizzasInDB[i].type == "cheese") {
                                pizzaShell.cheese = pizzasInDB[i].itemname;
                            }
                            if ((pizzasInDB[i].type != "sauce") && (pizzasInDB[i].type != "cheese")) {
                                pizzaShell.toppings.push(pizzasInDB[i].itemname);
                            }


                            //pizzaShell.sauce =

                        } else {
                            $scope.pizzasInCart.push(pizzaShell);

                            tempId = pizzasInDB[i].pizzaID;
                            tempSize = pizzasInDB[i].type;
                            pizzaShell = {};
                            pizzaShell.toppings = [];
                            pizzaShell.prices = [0, 0, 0, 0, 0, 0];
                            pizzaShell.crust = pizzasInDB[i].itemname;
                            pizzaShell.pizzaID = tempId;
                            pizzaShell.size = tempSize;

                        }
                    }

                    $scope.pizzasInCart.push(pizzaShell);

                    //get prices
                    var toppings = [];

                    for (i = 0; i < $scope.pizzasInCart.length; i++) {

                        getPrice($scope.pizzasInCart[i].crust, $scope.pizzasInCart[i].size, i);
                        toppings = $scope.pizzasInCart[i].toppings;
                        for (j = 0; j < toppings.length; j++) {
                            getPrice($scope.pizzasInCart[i].toppings[j], $scope.pizzasInCart[i].size, i);
                        }
                    }
                }

                loading=false;
            });
    }

    function addToCart(itemname, itemtype, pizzaID, toRefresh) {

        buttonApi.addToCart(itemname, itemtype, pizzaID)
            .success(function(){
                if(pizzaID==0){
                    refreshCart();
                }
                if (toRefresh){
                    refreshPizzaCart();

                }

            })


    }
    function addCrustToCart() {

        buttonApi.addToCart($scope.crusttype, $scope.pizzaSize, $scope.pizzaID)
            .success(function(){
                addPizzaToCart();


            })


    }



    function addPizzaToCart(){

        var toRefresh = false;

        //addToCart($scope.crusttype, $scope.pizzaSize, $scope.pizzaID, toRefresh);
        addToCart($scope.currentsauce, 'sauce', $scope.pizzaID, toRefresh);
        if ($scope.currenttopping.length == 0){
            toRefresh = true;
        }
        addToCart($scope.currentcheese, 'cheese', $scope.pizzaID, toRefresh);
        for (i = 0; i < $scope.currenttopping.length; i++){
            if (i == $scope.currenttopping.length-1){
                toRefresh = true;
            }
            addToCart($scope.currenttopping[i].name, $scope.pizzaSize, $scope.pizzaID, toRefresh);
        }
        $scope.pizzaID++;

        angular.forEach($scope.meatArray, function(meat) {
            meat.selected = false;
        });
        angular.forEach($scope.nonmeatArray, function(nonmeat) {
            nonmeat.selected = false;
        })
        $scope.currenttopping = [];
        //refreshPizzaCart();

    }



    function getSelectionPrices(itemname, size, spot){
        buttonApi.getPrice(itemname, size)
            .success(function(prices){
                $scope.selection[spot] = prices;
                $scope.currentPizzaPrices=[0,0,0,0,0,0];
                for(i = 0; i < $scope.selection.length; i++){
                    counter=0;

                    angular.forEach($scope.selection[i], function(store){


                        if(store == null || typeof $scope.currentPizzaPrices[counter] === 'string'){
                            $scope.currentPizzaPrices[counter] = "N/A";
                            counter++;
                        } else {
                            $scope.currentPizzaPrices[counter] += store;
                            counter++;
                        }
                    })
                }


            })
    }


    function getPrice(itemname, tablename, pizzaIndex){
        buttonApi.getPrice(itemname, tablename)
            .success(function(pricesDB){
                counter = 0;
                angular.forEach(pricesDB, function(store){
                   if (store == null || store == 0 || typeof $scope.pizzasInCart[pizzaIndex].prices[counter] === 'string'){
                       $scope.pizzasInCart[pizzaIndex].prices[counter] = "N/A";
                       $scope.totalPrices[counter] = "N/A";
                       counter++;
                   } else {
                       $scope.pizzasInCart[pizzaIndex].prices[counter] += store;
                       $scope.totalPrices[counter] += store;
                       counter++;
                   }
                });

            });
        //return defer.promise.$$state;
    }

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
    //getSelectionPrices("thick crust", "14in", 0);


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
        },
        deleteItem: function(itemname, pizzaID){
            var url = apiUrl+'/deleteItem?itemname=' + itemname+'&pizzaID=' + pizzaID;
            return $http.get(url);
        },
        logout: function(){
            var url = apiUrl+'/logout';
            return $http.get(url);
        },
        checkOut: function(){
            var url = apiUrl+'/checkOut';
            return $http.get(url);
        }

    };
}
