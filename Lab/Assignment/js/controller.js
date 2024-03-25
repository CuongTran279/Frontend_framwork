var app = angular.module("myapp", ['ngRoute']);
app.config(($routeProvider)=>{
    $routeProvider
    .when('/',{templateUrl:'includes/main_content.html',controller:'myctrl'})
    .when('/tracnghiem/:idMh/:tenSub/:des',{templateUrl:'includes/quizz.html',controller:'quizctrl'})
    .otherwise({templateUrl:'includes/main_content.html'});
});
app.controller("myctrl",($scope,$rootScope,$http,$location)=>{
    $scope.subs = [];
    $http.get("db/Subjects.js").then(
        (res)=>{$scope.subs = res.data ;},
        (res)=>{alert("Lỗi khi request môn học");}
    )
    // Phân trang
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
app.controller("quizctrl",($scope,$rootScope,$timeout,$http,$routeParams,$interval)=>{
    $scope.idMh = $routeParams.idMh;
    $scope.tenMh = $routeParams.tenSub;
    $scope.infor = $routeParams.des;
    $scope.ques = [];
    $http.get("db/Quizs/" + $scope.idMh+".js").then(
        (res)=>{$scope.ques = res.data;},
        (res)=>{console.log(res);;}
    );
    // Phân trang và đếm số thứ tự
    $scope.pageScount = Math.ceil($scope.ques.length / $scope.pageSize);
    $scope.stt = 1;
    $scope.start = 0;
    $scope.pageSize = 1;
    // $scope.next = ()=>{
    //     if($scope.start < $scope.ques.length - $scope.pageSize){
    //         $scope.start+=$scope.pageSize;
    //         $scope.stt++;
    //     }
    // }
    function next(){
        if($scope.start < $scope.ques.length - $scope.pageSize){
            $scope.start+=$scope.pageSize;
            $scope.stt++;
            $scope.answerSelected = false;
        }
    }
    // $scope.prev = ()=>{
    //     if($scope.start>0){
    //         $scope.start-=$scope.pageSize;
    //         $scope.stt--;
    //     }
    // }
    // $scope.first = ()=>{
    //     $scope.start = 0;
    //     $scope.stt=1;
    // }
    // $scope.last = ()=>{
    //     
    //     $scope.start = (pageScount-1)*$scope.pageSize;
    //     $scope.stt= $scope.ques.length;
    // }
    // Hiển thị câu hỏi
    $scope.show=false;
    $scope.hide=false;
    $scope.sogiay = 1000;
    $scope.answerSelected = false;

    $scope.selectAnswer = function() {
        // Đặt biến answerSelected thành true khi người dùng chọn một đáp án
        $scope.answerSelected = true;
    };
    $scope.hienThi = ()=>{
        $scope.show = true;
        $scope.hide=true;
        var countdownDate = new Date().getTime() + (15 * 60 * 1000); // 10 phút tính bằng mili giây
        var updateCountdown = function() {
            var now = new Date().getTime();
            var distance = countdownDate - now;

            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            $scope.countdown = minutes + ":" + seconds;

            if (distance < 0) {
                $interval.cancel(countdownInterval);
                $scope.countdown = "Hết thời gian";
            }
        };
        updateCountdown();
        var countdownInterval = $interval(updateCountdown, 1000);
    }
    // Tính điểm và đếm thời gian
    $scope.diem = 0;
    $scope.dapan = (ipDa,ipDad,diem)=>{
        if(ipDa == ipDad){
            $scope.diem+=diem;
            $timeout(next, 3000);
            $scope.selectAnswer();
        }else{
            $timeout(next, 3000);
            $scope.selectAnswer();
        }
    }
    // Nộp bài
    // $scope.submit=()=>{
    // }
    // 
});
