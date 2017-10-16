var app = angular.module('starter', [
    'ngCookies',
    'ionic',
    'ngCordova',
    'ngCordovaOauth',  
    'myAppConstants',
    'myAppRouter',
    'myAppBaseServiceModule',
    'myAppDaoServiceModule',
    'myAppUserServiceModule',
    'myAppCoreModule1',
    'myAppCoreModule2',
    'myAppCoreModule3',
    'myAppCoreModule4',
    'myAppDaoModule1',
    'myAppDaoModule2',
    'myAppDaoModule3'
])
.run(function ($rootScope, $cookieStore, $state, $ionicPlatform, $window) {
    $ionicPlatform.ready(function () {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            console.log('in cordova');
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);
            $rootScope.$on('$stateChangeStart', function (event, next, current) {
                var userInfo = $cookieStore.get('userInfo');
                if (!userInfo) {
                    // user not logged in | redirect to login
                    if (next.name !== "welcome") {
                        console.log('in rootScope if');
                        // not going to #welcome, we should redirect now
                        event.preventDefault();
                        $state.go('welcome');
                    }
                } else if (next.name === "welcome") {
                    console.log('in rootScope else');
                    event.preventDefault();
                    $state.go('dashboard');
                }
            })
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
            console.log('in cordova');
        }
    })
});