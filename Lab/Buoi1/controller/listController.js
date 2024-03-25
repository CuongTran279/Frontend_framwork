window.listController=($scope,$http)=>{
    var apiUrl = "";
    $scope.getList=()=>{
        $http.get(apiUrl).then(($respone)=>{
            $scope.products = $respone.data;
        })
    };
    $scope.getList();
}