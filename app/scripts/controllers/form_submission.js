'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams) {
  
      if ($stateParams.id == 1)
      {
          $scope.binderForm = $rootScope.form1;
      }
      else if ($stateParams.id == 2)
      {
          $scope.binderForm = $rootScope.form2;
      }
      else
      {
          $state.go("binder_form_list");
      }
      $scope.experts = $rootScope.experts;
      $scope.ce = $rootScope.ce;
      $scope.jp = $rootScope.jp;
      
      $scope.labelClass = function(type) {
          console.log(type);
          if (type == 'TEXT') {
              return 'col-sm-12';
          }
          else if (type == 'CE_APPROVAL') {
              return '';
          }
          else {
              return 'col-sm-12';
          }
      };
      
      $scope.submit = function () {
          $scope.formList[$stateParams.id - 1].state = 'submitted';
          $state.go('form_submissions');
      };
      
});
