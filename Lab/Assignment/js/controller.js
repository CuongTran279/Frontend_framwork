var app = angular.module("myapp", ['ngRoute']);
app.config(($routeProvider)=>{
    $routeProvider
    .when('/',{templateUrl:'includes/main_content.html',controller:'myctrl'})
    .when('/tracnghiem/:idMh/:tenSub',{templateUrl:'includes/quizz.html',controller:'quizctrl'})
    .otherwise({templateUrl:'includes/main_content.html'});
});
app.controller("myctrl",($scope,$rootScope,$http,$location)=>{
    $scope.subs = [];
    $http.get("db/Subjects.js").then(
        (res)=>{$scope.subs = res.data ;},
        (res)=>{alert("Lỗi khi request môn học");}
    )
    $rootScope.Description = $scope.Description;
    console.log($scope.subs);
    $scope.begin = 0;
    $scope.pageSize = 3;
    $scope.pageScount = Math.ceil($scope.subs.length / $scope.pageSize);
    $scope.first = function (){
        $scope.begin = 0;
        console.log($scope.begin);
    }
    $scope.prev =function (){
        if($scope.begin>0){
            $scope.begin-=$scope.pageSize;
        }
    }
    $scope.next =function (){
        if($scope.begin < $scope.subs.length - $scope.pageSize){
            $scope.begin += $scope.pageSize;
        }
    }
    $scope.last =function (){
        $scope.begin = ($scope.pageScount - 1) * $scope.pageSize;
    }
});
app.controller("quizctrl",($scope,$rootScope,$http,$routeParams,$interval)=>{
    $scope.idMh = $routeParams.idMh;
    $scope.tenMh = $routeParams.tenSub;
    $scope.infor = $rootScope.Description;
    $scope.ques = [];
    $http.get("db/Quizs/" + $scope.idMh+".js").then(
        (res)=>{$scope.ques = res.data;console.log(res.data);},
        (res)=>{console.log(res);;}
    );
    $scope.stt = 1;
    $scope.start = 0;
    $scope.pageSize = 1;
    $scope.next = ()=>{
        if($scope.start < $scope.ques.length - $scope.pageSize){
            $scope.start+=$scope.pageSize;
            $scope.stt++;
        }
    }
    $scope.prev = ()=>{
        if($scope.start>0){
            $scope.start-=$scope.pageSize;
            $scope.stt--;
        }
    }
    $scope.first = ()=>{
        $scope.start = 0;
        $scope.stt=1;
    }
    $scope.last = ()=>{
        pageScount = Math.ceil($scope.ques.length / $scope.pageSize);
        $scope.start = (pageScount-1)*$scope.pageSize;
        $scope.stt= $scope.ques.length;
    }
    $scope.sogiay = 0;
    $scope.diem = 0;
    $interval(()=>{
        $scope.sogiay++
    },1000);
    $scope.dapan = (ipDa,ipDad,diem)=>{
        if(ipDa == ipDad){
            $scope.diem+=diem;
        }
    }
    
});
