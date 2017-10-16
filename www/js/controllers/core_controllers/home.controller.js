angular.module('myAppCoreModule3', []).controller('HomeController', ['$scope', '$state', 'UserService', 'DataService',
    function ($scope, $state, UserService, DataService) {
        $scope.setUserType = function (type) {
            UserService.set("userType", type);
            console.log(UserService.get("userType"));
            if (UserService.get("userType") === 'C') {
                DataService.geoAPI(function () {
                    console.log('After geo called inside guestSignIn of HomeController');
                    $state.go('list');
                });
            } else {
                if (UserService.get("userType") === 'N') {
                    if (UserService.get("userStatus")) {
                        console.log('hi');
                        $state.go('seek');
                    }
                    else {
                        console.log('hi');
                        $state.go('signIn');
                    }
                }
            }
        };
    }
]);
