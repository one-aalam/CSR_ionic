angular.module('myAppCoreModule4', ['myAppConstants']).controller('WelcomeCtrl',
    ['$scope', '$state', '$cookieStore', '$http', 'UserService', 'DataService', 'BaseService', 'CHECKPOINT_LOGIN', 'CHECKPOINT_USER',
        function ($scope, $state, $cookieStore, $http, UserService, DataService, BaseService, CHECKPOINT_LOGIN, CHECKPOINT_USER) {
            $scope.userType = UserService.get("userType");

            if (UserService.get("userStatus") === undefined) {
                UserService.set("userStatus", false);
            }
            $scope.userStatus = UserService.get("userStatus");
            $scope.guestSignin = function () {

                if (UserService.get("userType") === 'C') {
                    DataService.geoAPI(function () {
                        console.log('After geo called inside guestSignIn of welcomeCtrl');
                        $state.go('list');
                    });
                } else {
                    if (UserService.get("userType") === 'N') {

                        $state.go('welcome');
                    } else {
                        $state.go('welcome');
                    }
                };
            };

            $scope.Signin = function (emailId, password) {
                $scope.errortext = "";
                if (emailId != null && password != null) {
                    var data = {
                        emailId: emailId,
                        password: password

                    };
                    console.log("***data from page ****", data);

                    var response = BaseService.postData(CHECKPOINT_LOGIN, undefined, undefined, data);
                    if (response !== null) {
                        console.log("userid from response", response.userId);
                        if (response.userId == "N" || response.userId == "W") {
                            $scope.errortext = "Invalid username or password. Please try again";
                            $state.go('signIn');
                        } else {
                            UserService.set("userId", response.userId);
                            var ngoId = "csr" + response.userId;
                            console.log("ngoId", ngoId);
                            UserService.set("ngoId", ngoId);
                            UserService.set("userStatus", true);
                            $scope.userStatus = UserService.get("userStatus");
                            $scope.reloadPage();
                            console.log("User", UserService.get("userId"), "Response", response);
                            $scope.show_menu = false;
                            $state.go('seek');
                        }
                    }
                }
                else {
                    $scope.errortext = "Username and Password can't be empty";
                }
            };

            $scope.user = $cookieStore.get('userInfo');
            $scope.logout = function () {
                console.log('In logout');
                $cookieStore.remove("userInfo");
                console.log("Hello");
                console.log('userInfo');
                UserService.set("userStatus", false);
                $scope.userStatus = UserService.get("userStatus");
                $scope.reloadPage();
                $state.go('home');
                UserService.remove("userStatus");
                UserService.remove("userId");
                UserService.remove("userType");
                $window.location.reload();
            };

            $scope.reloadPage = function () {
                window.location.reload();
            }

            $scope.fbLogin = function () {
                FB.login(function (response) {
                    if (response.authResponse) {
                        getUserInfo();
                    } else {
                        console.log('User cancelled login or did not fully authorize.');
                    }
                },
                    {
                        scope: 'email,user_photos,user_videos'
                    });

                function getUserInfo() {
                    FB.api('/me', function (response) {
                        console.log('Facebook Login RESPONSE: ' + angular.toJson(response));
                        FB.api('/me/picture?type=normal', function (picResponse) {
                            console.log('Facebook Login RESPONSE: ' + picResponse.data.url);
                            response.imageUrl = picResponse.data.url;
                            var user = {};
                            user.userName = response.name;
                            user.userId = response.id;
                            UserService.set("userId", response.id);
                            UserService.set("userStatus", true);
                            console.log("User", UserService.get("userId"), "Response", resp, "User", user);
                            var data = BaseService.getData(CHECKPOINT_USER, undefined);
                            if (!data) {
                                var response = BaseService.postData(CHECKPOINT_USER, undefined, undefined, user);
                                if (response.data)
                                    $scope.msg = "Api Call successfull";
                                console.log('Success---------');
                                $cookieStore.put('userInfo', user);
                                $state.go('dashboard');
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    console.log('inside for');
                                    var obj = data[i];
                                    console.log(obj);
                                    if (obj.userId == user.userId) {
                                        console.log('inside if');
                                        $cookieStore.put('userInfo', user);
                                        $scope.flag = 1;
                                        break;
                                    }
                                }
                                if ($scope.flag == 1) {
                                    if (UserService.get("userType") == 'C') {
                                        DataService.geoAPI(function () {
                                            console.log('geo called when existing user try to login');
                                            $state.go('list');
                                        });
                                    } else if (UserService.get("userType") == 'N') {
                                        $state.go('seek');
                                    }
                                } else {
                                    var response = BaseService.postData(CHECKPOINT_USER, undefined, undefined, user);
                                    if (response.data)
                                        $scope.msg = "Api Call successfull";
                                    console.log('Success');
                                    $cookieStore.put('userInfo', user);
                                    $state.go('dashboard');
                                }
                            }
                        });
                    });
                }
            };
            // END FB Login

            // Google Plus Login
            $scope.gplusLogin = function () {
                gapi.client.setApiKey(null);
                gapi.client.load('plus', 'v1', function () { });
                var myParams = {
                    // Replace client id with yours
                    'clientid': '374010870485-pq83isui0ccj4t1ts0elb8eo200ond3k.apps.googleusercontent.com',
                    'cookiepolicy': 'single_host_origin',
                    'callback': loginCallback,
                    'approvalprompt': 'force',
                    'scope': 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read'
                };
                gapi.auth.signIn(myParams);
                function loginCallback(result) {
                    if (result['status']['signed_in']) {
                        var request = gapi.client.plus.people.get({
                            'userId': 'me'
                        });
                        request.execute(function (resp) {
                            console.log('Google+ Login RESPONSE: ' + angular.toJson(resp));
                            var userEmail;
                            if (resp['emails']) {
                                for (var i = 0; i < resp['emails'].length; i++) {
                                    if (resp['emails'][i]['type'] == 'account') {
                                        userEmail = resp['emails'][i]['value'];
                                    }
                                }
                            }
                            var user = {};
                            user.userName = resp.displayName;
                            user.userId = resp.id;
                            UserService.set("userId", resp.id);
                            UserService.set("userStatus", true);
                            console.log("User", UserService.get("userId"), "Response", resp, "User", user);
                            var data = BaseService.getData(CHECKPOINT_USER, undefined);
                            if (!data) {
                                var response = BaseService.postData(CHECKPOINT_USER, undefined, undefined, user);
                                if (response.data)
                                    $scope.msg = "Api Call successfull";
                                console.log('Success---------');
                                $cookieStore.put('userInfo', user);
                                $state.go('dashboard');
                            } else {
                                for (var i = 0; i < data.length; i++) {
                                    console.log('inside for');
                                    var obj = data[i];
                                    console.log(obj);
                                    if (obj.userId == user.userId) {
                                        console.log('inside if');
                                        /*$state.go('list');*/
                                        $cookieStore.put('userInfo', user);
                                        $scope.flag = 1;
                                        break;
                                    }
                                }
                                if ($scope.flag == 1) {
                                    if (UserService.get("userType") == 'C') {
                                        DataService.geoAPI(function () {
                                            console.log('geo called inside welcome when existing user try to login');
                                            $state.go('list');
                                        });
                                    } else if (UserService.get("userType") == 'N') {
                                        $state.go('seek');
                                    }
                                } else {
                                    var response = BaseService.postData(CHECKPOINT_USER, undefined, undefined, user);
                                    if (response.data)
                                        $scope.msg = "Api Call successfull";
                                    console.log('Success---------');
                                    $cookieStore.put('userInfo', user);
                                    $state.go('dashboard');
                                }
                            }
                        });
                    }
                }
            };
            // END Google Plus Login
        }]);