var app = angular.module('myapp', ['ngRoute']);
app.config(($routeProvider)=>{
    $routeProvider
    .when('/',{templateUrl:'includes/main_content.html',controller:'myctrl'})
    .when('/tracnghiem/:idMh/:tenSub/:des',{templateUrl:'includes/quizz.html',controller:'quizctrl'})
    .otherwise({templateUrl:'includes/main_content.html'});
});
app.controller("myctrl",($scope,$rootScope,$http,$location)=>{
    // Lấy danh sách môn học
    $scope.subs = [];
    $http.get("db/Subjects.js").then(
        (res)=>{$scope.subs = res.data ;},
        (res)=>{alert("Lỗi khi request môn học");}
    )
    // Lấy danh sách người dùng và lấy value input
    var email = document.getElementsByName("email");
    var pass = document.getElementsByName("pass");
    var name = document.getElementsByName("name");
    $scope.Students = [];
    var apiUrl = "http://localhost:3000/user";
    $scope.Students = JSON.parse(localStorage.getItem('students'));
    if($scope.Students == null){
        $http.get(apiUrl).then(function ($response){
            $scope.user = $response.data;
            localStorage.setItem('students',JSON.stringify($response.data));
        })
    }
    // Đăng ký tài khoản
    $scope.dangKy = function() {
        var user = {
            email:email[0].value,
            pass:pass[0].value,
            name:name[0].value
        };
        check = $scope.Students.findIndex(st=> st.name == name[0].value)
        if(check>=0){
            alert("Tên đăng nhập đã tồn tại")
        }else{
                $http.post(apiUrl,user).then(function (response){
                alert("Đăng ký thành công");
                window.location.reload();
            }).catch(function(err){
                alert("Chưa thành công")
            })
        }
        
    }
    // Đăng nhập
    $rootScope.name = sessionStorage.getItem('name');
    $scope.login = function(){
        $rootScope.name = "";
        check = $scope.Students.findIndex(st=> st.name == name[1].value && st.pass == pass[1].value)
        if(check>=0){
            $rootScope.name = name[1].value;
            sessionStorage.setItem('name',name[1].value);
            alert("Đăng nhập thành công");
            window.location.reload();
        }else{
            alert("Tài khoản không tồn tại")
        }
        // console.log($scope.Students);
    }
    // Đăng xuất
    $scope.logOut=function(){
        $rootScope.name = "";
        sessionStorage.removeItem('name');
        window.location.reload();
    }
    // Tìm mật khẩu
    $scope.forget = function(){
        const user = $scope.Students.find(s=>s.email === email[1].value && s.name === name[2].value);
        if(user){
            alert("Mật khẩu của bạn là : " + user.pass)
        }else{
            alert("không tồn tại thông tin này")
        }
    }
    // Đổi mật khẩu
    $scope.changePass=function(){
        var pass_old = document.getElementsByName("pass_old");
        var pass_new1 = document.getElementsByName("pass_new1");
        user = $scope.Students.find(s=>s.name == $rootScope.name);
        var id = user.id;
        if(user.pass != pass_old[0].value){
            alert("Pass cũ của bạn không đúng");return;
        }
        user.pass = pass_new1[0].value;
        var changeUser = {
            email:user.email,
            name:user.name,
            pass:pass_new1[0].value
        }
        localStorage.setItem('students',JSON.stringify($scope.Students));
        $http.put(`${apiUrl}/${id}`,changeUser).then(function (response){
            // $location.path(`list`)
            alert("Đổi mật khẩu thành công")
        }).catch(function(err){
            alert("Đổi mật khẩu chưa thành công")
        })
        // alert("Đổi mật khẩu thành công");
    }
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
// Quizz controller
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
    function next(){
        if($scope.start < $scope.ques.length - $scope.pageSize){
            $scope.start+=$scope.pageSize;
            $scope.stt++;
            $scope.answerSelected = false;
            again(true);
        }
    }
    // Hiển thị câu hỏi
    $scope.show=false;
    $scope.hide=false;
    $scope.time=false;
    $scope.sogiay = 1000;
    $scope.answerSelected = false;

    $scope.selectAnswer = function() {
        $scope.answerSelected = true;
    };
    $scope.hienThi = ()=>{
        $scope.show = true;
        $scope.hide=true;
        var countdownDate = new Date().getTime() + (20 * 60 * 1000);
        var updateCountdown = ()=>{
            var now = new Date().getTime();
            var distance = countdownDate - now;
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            $scope.countdown = minutes + ":" + seconds;
            if (distance < 0) {
                $interval.cancel(countdownInterval);
                $scope.countdown = "Hết thời gian";
                alert("Bài làm của bạn đã được nộp lên hệ thống");
            }
        };
        updateCountdown();
        var countdownInterval = $interval(updateCountdown, 1000);
    }
    // Tính điểm và kiểm tra đáp án
    $scope.diem = 0;
    $scope.dapan = (ipDa,ipDad,diem)=>{
        var and = document.querySelector('label[for="'+ipDad+'"]');
        var ans = document.querySelector('label[for="'+ipDa+'"]');
        if(ipDa == ipDad){
            $scope.diem+=diem;
            again(check);
            if($scope.stt < 10){
                $timeout(next, 2000);
            }
            $scope.selectAnswer();
            ans.style.color = "red";
            and.style.color = "green";
        }else{
            again(check);
            if($scope.stt < 10){
                $timeout(next, 2000);
            }
            $scope.selectAnswer();
            ans.style.color = "red";
            and.style.color = "green";
        }
    }
    // Đếm ngược thời gian gạch đỏ
    var check = false;
    function again(check){
        if(check){
            time_out.style.width = '0';
            time_out.style.transition = 'width 0s linear';
        }else{
            time_out.style.width = '100%';
            time_out.style.transition = 'width 2s linear';
        }
        
    }
    var time_out = document.querySelector(".time-out");
    // Nộp bài
    $scope.submit=()=>{
        if($scope.stt < 11){
            alert("Chưa hoàn thành hết các câu hỏi chưa thể nộp");            
        }else{
            $scope.Students = JSON.parse(localStorage.getItem('students'));
            const check = $scope.Students.find(st=> st.name == $scope.name);
            var result = {
                idUser:check.id,
                name:check.name,
                mark:$scope.diem,
                idMh:$scope.idMh,
                tenMh:$scope.tenMh
            }
            $http.post('http://localhost:3000/result',result).then(function (response){
                $scope.show = false;
                alert("Nộp bài thành công");
                $location.path('/');
            });
        }
    }
    // Kiểm tra nộp bài
    window.addEventListener('beforeunload',e=>{
        if($scope.show){
            e.preventDefault();
        }
    })
    $rootScope.$on('$locationChangeStart', function(event, next, current) {
        // Kiểm tra xem đường dẫn hiện tại có khác với đường dẫn người dùng bấm vào hay không
        if($scope.show){
            if (next !== current) {
                // Hiển thị thông báo cho người dùng
                if (!confirm("Chưa hoàn thành bài bạn có chắc muốn rời khỏi trang này")) {
                    event.preventDefault();
                }
            }
        }
    });
    $scope.$on('$locationChangeSuccess', function(event, next, current) {
        $scope.show = false;
    });
});
