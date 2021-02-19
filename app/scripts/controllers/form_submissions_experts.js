'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionsExpertsCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, SkillForms) {
  
      $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

          $scope.forms = SkillForms.get({skillId: $scope.skill.id}, function () {
              $scope.loading = false;
          }, function () {
              // error
              $scope.loading = false;
          });

      }, function () {
          // error
          $scope.loading = false;
      });

});

angular.module('skillMgmtApp').controller('FormSubmissionsExpertsFormCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, Form, SkillFormSubmission) {

    $scope.loading = true;

    $scope.form = Form.get({id: $stateParams.formId});

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

    }, function () {
        // error
        $scope.loading = false;
    });

    $scope.submissions = SkillFormSubmission.query({formId: $stateParams.formId, skillId: $stateParams.skillId}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

});

angular.module('skillMgmtApp').controller('FormSubmissionsExpertsSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, Form, SkillFormSubmission) {

    $scope.loading = true;

    $scope.submission = SkillFormSubmission.get({formId: $stateParams.formId, skillId: $stateParams.skillId, id: $stateParams.id}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

});
