'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, FormSubmission, FormSubmissionField, FormSubmissionFieldPerson) {

    $scope.submission = FormSubmission.save({formId: $stateParams.formId, skillId: $stateParams.skillId}, {}, function (submission) {
        $scope.loading = false;
        /*
        attempt.questions.forEach(function (question) {
            if (question.answer !== null) {
                $scope.questions[question.id] = question.answer.id;
            }
        });
        */
    });

    var timeoutsFields = {};
    $scope.fieldChanged = function (field) {
        var updateField = function () {
            FormSubmissionField.update({submissionId: $scope.submission.id}, field);
        };
        if (field.type == 'input_textarea' || field.type == 'input_text') {
            if (field.id in timeoutsFields) {
                $timeout.cancel(timeoutsFields[field.id]);
            }
            timeoutsFields[field.id] = $timeout(updateField, 1000);
        } else {
            updateField();
        }
    };

    $scope.personChanged = function (field, person) {
        if (person.value.length == 4) {
            FormSubmissionFieldPerson.update({
                submissionId: $scope.submission.id,
                fieldId: field.id,
                personId: person.person.id
            }, person, function (p) {
                person.checked = p.checked;
            });
        }
    };

/*
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
*/
});
