'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, alert, FormSubmission, FormSubmissionField, FormSubmissionFieldPerson) {

    $scope.submission = FormSubmission.save({formId: $stateParams.formId, skillId: $stateParams.skillId}, {}, function (submission) {
        $scope.loading = false;
    });

    var saved = function () {
        $scope.saving = false;
        $scope.saved = true;
    };

    var timeoutsFields = {};
    $scope.fieldChanged = function (field) {
        var updateField = function () {
            $scope.saving = true;
            FormSubmissionField.update({submissionId: $scope.submission.id}, field, saved);
        };
        if (field.id in timeoutsFields) {
            $timeout.cancel(timeoutsFields[field.id]);
        }
        timeoutsFields[field.id] = $timeout(updateField, 1000);
    };

    $scope.fieldChecked = function (field) {
        $scope.saving = true;
        FormSubmissionField.update({submissionId: $scope.submission.id}, field, saved);
    };

    var timeoutsFieldPersons = {};
    $scope.fieldPersonChanged = function (field, person) {
        var key = field.id + '_' + person.person.id;
        var updateField = function () {
            $scope.saving = true;
            FormSubmissionFieldPerson.update({
                submissionId: $scope.submission.id,
                fieldId: field.id,
                personId: person.person.id
            }, person, saved);
        };
        if (key in timeoutsFieldPersons) {
            $timeout.cancel(timeoutsFieldPersons[key]);
        }
        timeoutsFieldPersons[key] = $timeout(updateField, 1000);
    };

    $scope.personChecked = function (field, person) {
        $scope.saving = true;
        FormSubmissionFieldPerson.update({
            submissionId: $scope.submission.id,
            fieldId: field.id,
            personId: person.person.id
        }, person, saved);
    };

    $scope.pinChanged = function (field, person) {
        if (person.pin.length == 4) {
            $scope.saving = true;
            FormSubmissionFieldPerson.update({
                submissionId: $scope.submission.id,
                fieldId: field.id,
                personId: person.person.id
            }, person, function (p) {
                person.checked = p.checked;
                person.pin = '';
                saved();
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
