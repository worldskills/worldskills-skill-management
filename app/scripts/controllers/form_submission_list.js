'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionListCtrl', function ($scope, $rootScope) {

        $scope.formList = $rootScope.formList;
        $scope.experts = $rootScope.experts;
        $scope.ce = $rootScope.ce;
        $scope.jp = $rootScope.jp;
});
