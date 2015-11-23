angular.module('buttons',[])
    .controller('buttonCtrl',ButtonCtrl)
    .factory('buttonApi',buttonApi)
    .constant('apiUrl','http://146.57.34.125:1338'); //CHANGE for the lab!

function ButtonCtrl($scope,buttonApi){
    $scope.buttons=[]; //Initially all was still
    $scope.errorMessage='';
    $scope.isLoading=isLoading;
    $scope.buttonClick=buttonClick;

    var loading = false;

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
        }
    };
}