angular.module('myAppDaoModule1', ['myAppConstants']).controller('charityDetailCtrl',
    ['$scope', '$http', '$state', 'UserService', 'BaseService', 'CHARITY_ENDPOINT', 'DELETE',
        function ($scope, $http, $state, UserService, BaseService, CHARITY_ENDPOINT, DELETE) {
           
            if (UserService.get("userStatus")) {
                
                var data = BaseService.getData(CHARITY_ENDPOINT, encodeURI(UserService.get("ngoId")));
                if (data != null) {
                    
                    $scope.charity = data;
                    $scope.event = data.charityEvent;
                   
                }
            } else {
                $state.go('home');
            }
            $scope.Update = function (reqId) {
               
                var response = BaseService.putData(CHARITY_ENDPOINT, encodeURI(UserService.get("ngoId")), DELETE, encodeURI(reqId));
                if (response != null) {
                    if (response.data) {
                        $scope.msg = "Put Data Method Executed Successfully!";
                    }
                }
            };
        }]);