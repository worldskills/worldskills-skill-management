'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, alert, FormSubmission, FormSubmissionField, FormSubmissionFieldPerson) {

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

    $scope.submit = function () {
        $scope.submission.state = 'submitted';
        $scope.submission.$update(function () {
            alert.success('The form has been submitted successfully.');
            $state.go('form_submission_list');
        });
    };
});
