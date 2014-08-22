'use strict';

angular.module('skillMgmtApp')
  .controller('BinderFormListCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular, REST_BASE_URL) {
  
	  $scope.formList = $rootScope.formList;
	  $scope.experts = $rootScope.experts;
	  $scope.ce = $rootScope.ce;
	  $scope.jp = $rootScope.jp;
  });