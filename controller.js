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
    $scope.getToppings=getToppings;
    $scope.toppingSelect = toppingSelect;
    //constants
    $scope.sizecrust= 12;
    $scope.crusttype="thick crust";
    $scope.currentsizecrust="12 inch Thick Crust";
    $scope.currentcheese="Mozzarella Cheese";
    $scope.currentsauce="Tomato Sauce";
    $scope.currenttopping = [];
    $scope.newname="";
    $scope.newpassword="";
    $scope.newpassword1="";
    $scope.newmail="";
    $scope.newaddress="";
    $scope.newphone="";
    $scope.newcard="";
    $scope.username="";
    $scope.password="";
    $scope.meatArray=[];
    $scope.nonmeatArray=[];
    $scope.crustArray=[];




    var loading = false;


    function cheeseSelect(cheese){
       $scope.currentcheese = cheese;
    }
    function sauceSelect(sauce){
        $scope.currentsauce = sauce;
    }

    function crustSelect(id){
        $scope.sizecrust = id;
        switch (true) {
            case (id < 20):
                $scope.currentsizecrust = id + " inch Thick Crust";
                $scope.crusttype = "thick crust";
                break;
            case (id< 30):
                id = id - 10;
                $scope.currentsizecrust = id + " inch Thin Crust";
                $scope.crusttype = "thin crust";
                break;
            case (id< 40):
                id = id - 20;
                $scope.currentsizecrust = id + " inch Pan Crust";
                $scope.crusttype = "pan crust";
                break;
            case (id< 50):
                id = id - 30;
                $scope.currentsizecrust = id + " inch Deep Dish Crust";
                $scope.crusttype = "deep dish crust";
                break;
            case (id< 60):
                id = id - 40;
                $scope.currentsizecrust = id + " inch Glutton-free Crust";
                $scope.crusttype = "gluten free crust";
                break;
        }


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

    function getToppings(){
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
                console.log($scope.meatArray)
                loading = false;
            }
        )
            .error(function() {
                loading = false;
            })
    }

    function toppingSelect(toppingName){

        if($scope.currenttopping.indexOf(toppingName) == -1) {
            $scope.currenttopping.push(toppingName);
        } else {
            $scope.currenttopping.splice($scope.currenttopping.indexOf(toppingName), 1);
        }
        console.log($scope.currenttopping);
    }

    getToppings();
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
        }
    };
}