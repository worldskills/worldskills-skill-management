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

angular.module('skillMgmtApp').controller('AdminFormDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $location, Form) {

    $scope.id = $stateParams.id;

    $scope.model = Form.get({id: $scope.id}, function () {
        $scope.title = $scope.model.name.text;
        if (!$scope.model.description) {
            $scope.model.description = {text: '', lang_code: 'en'};
        }
    });

});

angular.module('skillMgmtApp').controller('AdminFormDetailFormCtrl', function ($scope, $rootScope, $state, $stateParams, $http, WORLDSKILLS_API_EVENTS, alert) {

    $http({
        method: 'GET',
        url: WORLDSKILLS_API_EVENTS,
        params: {
            limit: 100,
            l: 'en',
            sort: 'name_asc'
        }
    }).success(function(data, status, headers, config) {
        $scope.events = data.events;
    });

    $scope.save = function() {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $scope.loading = true;
            if ($scope.model.id) {
                $scope.model.$update(function () {
                    alert.success('The Form has been saved successfully.');
                    $state.go('admin_form.list');
                }, function (response) {
                    window.alert('Error saving Form.');
                    $scope.loading = false;
                });
            } else {
                $scope.model.$save(function () {
                    alert.success('The Form has been added successfully.');
                    $state.go('admin_form.detail.form', {id: $scope.model.id});
                }, function (response) {
                    if (response.status == 401) {
                        window.alert('Insufficient permissions for to adding a new Form to this Competition.');
                    } else {
                        window.alert('Error while adding Form.');
                    }
                    $scope.loading = false;
                });
            }
        }
    };
});
