app.controller('DetailController', ['$scope', '$http', '$state',
  function ($scope, $http, $state) {
    $scope.ngoId = $state.params.ngoId;
    $http.get('https://csrsample.herokuapp.com/charity/' + encodeURI($scope.ngoId)).success(function (data) {
      $scope.charity = data;
    });
  }
]);
