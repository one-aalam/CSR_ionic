angular.module('myAppCoreModule1', []).controller('DashboardCtrl',
    function ($scope, $window, $state, $cookieStore, UserService, DataService) {
        $scope.submit = function () {
            if (UserService.get("userType") == 'C') {
                DataService.geoAPI(function () {
                    $state.go('list');
                });
            } else {
                if (UserService.get("userType") == 'N') {
                    $state.go('seek');
                } else {
                    $state.go('home');
                }
            }
            $window.location.reload();
        };
    });