angular.module('myAppCoreModule1', []).controller('DashboardCtrl',
    function ($scope, $window, $state, $cookieStore, UserService, DataService) {
        $scope.submit = function () {
            console.log('In submit');
            if (UserService.get("userType") == 'C') {
                DataService.geoAPI(function () {
                    console.log('geo called inside welcome when new user try to login');
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