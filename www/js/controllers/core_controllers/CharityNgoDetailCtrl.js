angular.module('myAppCoreModule2', ['myAppConstants']).controller('DetailNgoController',
    ['$scope', '$state', 'BaseService', 'CHARITY_ENDPOINT',
        function ($scope, $state, BaseService, CHARITY_ENDPOINT) {
            $scope.ngoId = $state.params.ngoId;
            $scope.charity = BaseService.getData(CHARITY_ENDPOINT + encodeURI($scope.ngoId));
        }
    ]);