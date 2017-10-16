angular.module('myAppCoreModule3', []).controller('HomeController', ['$scope', '$state', 'UserService', 'DataService',
    function ($scope, $state, UserService, DataService) {
        $scope.setUserType = function (type) {
            UserService.set("userType", type);
            if (UserService.get("userType") === 'C') {
                DataService.geoAPI(function () {
                    $state.go('list');
                });
            } else {
                if (UserService.get("userType") === 'N') {
                    if (UserService.get("userStatus")) {
                        $state.go('seek');
                    }
                    else {
                        $state.go('SignIn');
                    }
                }
            }
        };
    }
]);
