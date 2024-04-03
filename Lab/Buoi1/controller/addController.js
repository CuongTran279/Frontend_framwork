window.addController= function($scope,$http,$location){
    var apiUrl = "http://localhost:3000/Product";
    $scope.add = function(){
        var product = {
            ...$scope.value
        }
        var inValid = false;
        if(!$scope.value || !$scope.value.Name){
            inValid = true;
        }
        if(!$scope.value || !$scope.value.Des){
            inValid = true;
        }
        if(!$scope.value || !$scope.value.Price){
            inValid = true;
        }
        if(!inValid){
            $http.post(apiUrl,product).then(function (response){
                $location.path(`list`)
            }).catch(function($err){
                alert("Chưa thành công")
            })
        }
        
    }
}