// window.listController=($scope,$http)=>{
//     var apiUrl = "http://localhost:3000/Product";
//     $scope.getList=()=>{
//         $http.get(apiUrl).then(($respone)=>{
//             $scope.products = $respone.data;
//             // console.log($respone.data);
//         })
//     };
//     $scope.getList();
// }
window.ListController = function ($scope, $http, $location) {
    var apiUrl = "http://localhost:3000/Product";
    //khai báo hàm
    $scope.getList = function () {
        $http.get(apiUrl).then(function ($response) {
            $scope.products = $response.data;
        })
    }
    $scope.detail = function (id){
        $location.path(`detail/${id}`)
    }
    $scope.delete = function (id){
        if(confirm("Bạn có chắc muốn xóa không")){
            $http.delete(`${apiUrl}/${id}`).then(function (response) {
                alert("Xóa thành công");
                $scope.getList(); 
            })
        }
    }
    $scope.getList(); //gọi hàm
}