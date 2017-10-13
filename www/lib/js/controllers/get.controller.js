angular.module('starterGetController', []).controller('GetController', ['$scope', '$http', '$state', 'UserService', function ($scope, $http, $state, UserService) {
    console.log(UserService.get("userSatus"));
    if (UserService.get("userStatus")) {
        console.log(UserService.get("ngoId"));
        $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId"))).success(function (data) {
            console.log(data);
            $scope.charity = data;
            $scope.event = data.charityEvent;
            console.log('event', $scope.charity);
        });
    } else {
        $state.go('home');
    }
    $scope.Update = function (reqId) {
        console.log(reqId);
        console.log("userid-ngo", UserService.get("ngoId"));
        $http.put('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId")) + '/delete/' + encodeURI(reqId)).then(function (response) {
            if (response.data){
                $scope.msg = "Put Data Method Executed Successfully!";
            }
        });
    };
}]);