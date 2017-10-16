angular.module('myAppDaoModule1', ['myAppConstants']).controller('GetController',
    ['$scope', '$http', '$state', 'UserService', 'BaseService', 'CHARITY_ENDPOINT', 'DELETE',
        function ($scope, $http, $state, UserService, BaseService, CHARITY_ENDPOINT, DELETE) {
            console.log(UserService.get("userSatus"));
            if (UserService.get("userStatus")) {
                console.log(UserService.get("ngoId"));
                var data = BaseService.getData(CHARITY_ENDPOINT, encodeURI(UserService.get("ngoId")));
                if (data != null) {
                    console.log(data);
                    $scope.charity = data;
                    $scope.event = data.charityEvent;
                    console.log('event', $scope.charity);
                }
            } else {
                $state.go('home');
            }
            $scope.Update = function (reqId) {
                console.log(reqId);
                console.log("userid-ngo", UserService.get("ngoId"));
                var response = BaseService.putData(CHARITY_ENDPOINT, encodeURI(UserService.get("ngoId")), DELETE, encodeURI(reqId));
                if (response != null) {
                    if (response.data) {
                        $scope.msg = "Put Data Method Executed Successfully!";
                    }
                }
            };
        }]);