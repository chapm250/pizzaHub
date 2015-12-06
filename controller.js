angular.module('buttons',[])
    .controller('buttonCtrl',ButtonCtrl)
    .factory('buttonApi',buttonApi)
    .constant('apiUrl','http://localhost:1338'); //CHANGE for the lab!


function ButtonCtrl($scope,buttonApi){
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
    //$scope.meats=[];




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
        )
        buttonApi.getDrank()
            .success(function(data){
                for(i = 0; i < data.length; i++) {
                    $scope.drinksArray.push(data[i])

                }
                loading = false;
            }
        )
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

        //if($scope.currenttopping.indexOf(toppingName) == -1) {
        //    $scope.currenttopping.push(toppingName);
        //} else {
        //    $scope.currenttopping.splice($scope.currenttopping.indexOf(toppingName), 1);
        //}
        //console.log($scope.meats);
        console.log($scope.currenttopping);
    }

    function addToCart(itemname, itemtype, pizzaID) {
        buttonApi.addToCart(itemname, itemtype, pizzaID)
            .success(function(){
                //refreshCart();

            })


    }
    function addPizzaToCart(){
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

    }

    getShit();
}





function buttonApi($http,apiUrl){
    return{
        getToppings: function(){
            var url = apiUrl+'/getToppings';
            return $http.get(url);
        },
        clickButton: function(id){
            var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
            return $http.get(url); // Easy enough to do this way
        },
        register: function(name, password, phone, card, address, mail){
            var url = apiUrl+'/register?name=' + name + '&password=' + password + '&phone=' + phone + '&card=' + card
                + '&address=' + address + '&mail=' + mail;
            console.log(mail);
            return $http.get(url);
        },
        login: function(username, password){
            var url = apiUrl+'/login?username='+username+'&password='+password;
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
        addToCart: function(itemname, itemtype, pizzaID){
            var url = apiUrl+'/addToCart?itemname=' + itemname+'&itemtype=' +itemtype+'&pizzaID='+pizzaID;
            return $http.get(url);
        }

    };
}