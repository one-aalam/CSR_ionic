angular.module('myAppDaoModule3', ['myAppConstants']).controller('PutController',
    ['$scope', '$http', '$state', 'UserService', 'BaseService', 'CHARITY_ENDPOINT', 'EVENT',
        function ($scope, $http, $state, UserService, BaseService, CHARITY_ENDPOINT, EVENT) {
            $scope.form = {};
            $scope.frm = {};
            $scope.errortext = "";

            if (UserService.get("userStatus")) {
                $scope.cause = null;
                console.log('putserviceCtrl called');
                $scope.requirement = [];
                $scope.category = null;
                $scope.product = null;
                $scope.quantity = null;

                $scope.putdata = function (frm) {
                    if (frm.cause != null && frm.category != null && frm.product != null && frm.quantity != null) {
                        var data = {
                            cause: frm.cause,
                            requirement: [{
                                reqId: new Date().getTime().toString(),
                                category: frm.category,
                                product: frm.product,
                                quantity: frm.quantity,
                                status: true
                            }]
                        };

                        var ngoId = UserService.get("ngoId");
                        console.log(UserService.get("userId"));
                        console.log("NGOId", ngoId);

                        var response = BaseService.putData(CHARITY_ENDPOINT, encodeURI(UserService.get("ngoId")), EVENT, data);
                        if (response.data)
                            $scope.msg = "Put Data Method Executed Successfully!";
                        $scope.reset();
                        $scope.reloadPage();
                        $state.go('seek', { reload: true });
                    } else {
                        $scope.errortext = "All Fields are necessary";
                    }
                };
            } else {
                $state.go('home');
            }
            $scope.reset = function () {
                $scope.frm = {};
                $scope.form.signInForm.$setPristine();
            };
            $scope.reloadPage = function () {
                window.location.reload();
            }

        }]);
