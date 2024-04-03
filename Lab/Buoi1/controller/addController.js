window.addController= function($scope,$http,$location){
    var apiUrl = "http://localhost:3000/Product";
    $scope.add = function(){
        var product = {
            ...$scope.value
        }
        $http.post(apiUrl,product).then(function (response){
            $location.path(`list`)
        }).catch(function($err){
            alert("Chưa thành công")
        })
    }
}