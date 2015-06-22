'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, alert, FormSubmission, FormSubmissionField, FormSubmissionFieldPerson) {

    $scope.submission = FormSubmission.save({formId: $stateParams.formId, skillId: $stateParams.skillId}, {}, function (submission) {
        $scope.loading = false;
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

    $scope.pinChanged = function (field, person) {
        if (person.pin.length == 4) {
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
