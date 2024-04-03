window.editController = function($scope,$http,$routeParams,$location){
    var apiUrl = "http://localhost:3000/Product";
    var id = $routeParams.id;
    $scope.getDetail = function(){
        $http.get(`${apiUrl}/${id}`).then(function(respone){
            if(respone.status = 200){
                $scope.product = respone.data;
            }
        })
    }
    $scope.update = function(){
        var updatePro = {
            ...$scope.product
        }
        
        $http.put(`${apiUrl}/${id}`,updatePro).then(function (response){
            $location.path(`list`)
            // alert("thành công")
        }).catch(function(err){
            alert("Chưa thành công")
        })
    }
    $scope.getDetail();
}