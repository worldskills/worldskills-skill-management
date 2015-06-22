'use strict';


angular.module('skillMgmtApp').controller('AdminFormCtrl', function($scope) {
    $scope.pagination = {
        currentPage: 1,
        itemsPerPage: 10
    };
});

angular.module('skillMgmtApp').controller('AdminFormListCtrl', function ($scope, $rootScope, $state, $stateParams, $location, Form) {

    var page = parseInt($stateParams.page, 10);
    if (page) {
        $scope.pagination.currentPage = page;
    } else {
        $location.search('page', $scope.pagination.currentPage);
    }

    $scope.load = function (page) {

        $scope.loading = true;

        var filters = angular.copy($scope.filters);
        filters.offset = $scope.pagination.itemsPerPage * (page - 1);

        $scope.forms = Form.query(filters, function (data) {
            $scope.loading = false;
            $scope.pagination.currentPage = page;
        });
    };

    $scope.changePage = function (page) {
        $location.search('page', page);
        $scope.load(page);
    };

    $scope.clear = function () {
        $scope.filters = {
            limit: $scope.pagination.itemsPerPage
        };
        $scope.load($scope.pagination.currentPage);
    };

    $scope.clear();
});
