'use strict';

angular.module('skillMgmtApp')
  .controller('BinderFormCtrl', function ($scope, $rootScope, $stateParams, $translate, alert, Restangular, REST_BASE_URL) {
  
	  $scope.binderForm = $rootScope.form1;
	  $scope.experts = $rootScope.experts;
	  $scope.ce = $rootScope.ce;
	  $scope.jp = $rootScope.jp;
  });