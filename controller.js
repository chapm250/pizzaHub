angular.module('buttons',[])
    .controller('buttonCtrl',ButtonCtrl)
    .factory('buttonApi',buttonApi)
    .constant('apiUrl','http://146.57.34.125:1338'); //CHANGE for the lab!


function ButtonCtrl($scope,buttonApi){
    $scope.buttons=[]; //Initially all was still
    $scope.errorMessage='';
    $scope.isLoading=isLoading;
    $scope.buttonClick=buttonClick;
    $scope.crustSelect = crustSelect;
    $scope.cheeseSelect = cheeseSelect;
    $scope.sauceSelect = sauceSelect;
    $scope.gotoregister=gotoregister;
    $scope.sizecrust= 12;
    $scope.crusttype="thick crust";
    $scope.currentsizecrust="12 inch Thick Crust";
    $scope.currentcheese="Mozzarella Cheese";
    $scope.currentsauce="Tomato Sauce";
    $scope.newname="";
    $scope.newpassword="";
    $scope.newpassword1="";
    $scope.newmail="";
    $scope.newaddress="";
    $scope.newphone="";
    $scope.newcard="";
    $scope.username="";
    $scope.password="";



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

    function register(){
    buttonApi.register($scope.newname, $scope.newpassword, $scope.newphone, $scope.newcard, $scope.newaddress, $scope.newmail)
        .success(function(data){
            document.getElementsByClassName("loggedIn")[0].setAttribute("style", "display:inline;");
            document.getElementsByClassName("register")[0].setAttribute("style", "display:none;");
        })
        .error(function(){scope.errorMessage="Unable login;"});
    }

    function isLoading(){
        return loading;
    }

    }
    function buttonClick($event){
        $scope.errorMessage='';
        buttonApi.clickButton($event.target.id)
            .success(function(){})
            .error(function(){$scope.errorMessage="Unable click";});
}

function buttonApi($http,apiUrl){
    return{
        clickButton: function(id){
            var url = apiUrl+'/click?id='+id;
//      console.log("Attempting with "+url);
            return $http.get(url); // Easy enough to do this way
        },
        register: function(name, password, phone, card, address, mail){
            var url = apiUrl+'/register?name=' + name + '&password=' + password + '&phone=' + phone + '&card=' + card
                + '&address=' + address + '&mail' + mail;
            return $http.get(url);
        }
    };
}