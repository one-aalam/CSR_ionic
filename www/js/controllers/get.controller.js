app.controller('GetController', ['$scope', '$http', '$state', 'UserService', function ($scope, $http, $state, UserService) {

  if (UserService.get("userStatus")) {

    $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId"))).success(function (data) {
      $scope.charity = data;
      $scope.event = data.charityEvent;
    });
  } else {
    $state.go('home');
  }
  $scope.Update = function (reqId) {

    $http.put('https://csrsample.herokuapp.com/charity/' + encodeURI(UserService.get("ngoId")) + '/delete/' + encodeURI(reqId)).then(function (response) {
      if (response.data)
        $scope.msg = "Put Data Method Executed Successfully!";
    });
  };
}]);
