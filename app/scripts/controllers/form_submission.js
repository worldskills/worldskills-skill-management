'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $timeout, $filter, auth, alert, Upload, WORLDSKILLS_API_SKILLMAN, FormSubmission, FormSubmissionField, FormSubmissionFieldPerson, FormSubmissionFieldFile) {

    $scope.submission = FormSubmission.save({formId: $stateParams.formId, skillId: $stateParams.skillId}, {}, function () {
        if ($scope.submission.state == 'submitted') {
            alert.error('The form has been already been submitted and can\'t be edited anymore.');
            $state.go('form_submission_list', {eventId: $scope.submission.skill.event.id, skillId: $scope.submission.skill.id});
        }
        $scope.loading = false;
    });

    $scope.saving = false;
    var saved = function () {
        $scope.saving = false;
        $scope.saved = true;
    };

    var errored = function (httpResponse) {
        if (httpResponse.status == 401) {
            // Unauthorized

            window.alert('Your session has timed out. The page will now refresh and you might need to login again.');

            // reload page
            window.location.reload(false)

        } else {
            if (httpResponse.data.user_msg) {
                window.alert('Error: ' + httpResponse.data.user_msg);
            } else {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            }
        }
        $scope.saving = false;

        return {};
    };

    var promises = [];

    $scope.loading = true;
    $scope.submitted = false;
    $scope.submitting = false;

    var timeoutsFields = {};
    $scope.submissionChanged = function () {
        var updateSubmission = function () {
            $scope.saving = true;
            var submissionUpdate = $scope.submission.$update(saved, errored);
            promises.push(submissionUpdate.$promise);
        };
        if (0 in timeoutsFields) {
            $timeout.cancel(timeoutsFields[0]);
        }
        timeoutsFields[0] = $timeout(updateSubmission, 1000);
    };

    $scope.fieldChanged = function (field) {
        var updateField = function () {
            $scope.saving = true;
            var fieldUpdate = FormSubmissionField.update({formId: $scope.submission.form.id, skillId: $scope.submission.skill.id}, field, saved, errored);
            promises.push(fieldUpdate.$promise);
        };
        if (field.id in timeoutsFields) {
            $timeout.cancel(timeoutsFields[field.id]);
        }
        timeoutsFields[field.id] = $timeout(updateField, 1000);
    };

    $scope.fieldChecked = function (field) {
        $scope.saving = true;
        var fieldUpdate = FormSubmissionField.update({formId: $scope.submission.form.id, skillId: $scope.submission.skill.id}, field, saved, errored);
        promises.push(fieldUpdate.$promise);
    };

    $scope.fieldUploadFiles = function(field, $files) {
        field.uploading = $files;
        angular.forEach($files, function(file) {
            var uploadPromise = Upload.upload({
                url: WORLDSKILLS_API_SKILLMAN + '/forms/' + $scope.submission.form.id + '/skills/' + $scope.submission.skill.id + '/submission/fields/' + field.id + '/file',
                data: {file: file}
            }).then(function (response) {
                field.files.push(response.data);
            }, errored, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
            promises.push(uploadPromise);
        });
    };

    $scope.deleteFieldFile = function (field, file) {
        var index = field.files.indexOf(file);
        field.files.splice(index, 1);
        var fieldUpdate = FormSubmissionFieldFile.delete({formId: $scope.submission.form.id, skillId: $scope.submission.skill.id, fieldId: field.id}, file);
        promises.push(fieldUpdate.$promise);
    };

    var timeoutsFieldPersons = {};
    $scope.fieldPersonChanged = function (field, person) {
        var key = field.id + '_' + person.person.id;
        var updateField = function () {
            $scope.saving = true;
            var fieldUpdate = FormSubmissionFieldPerson.update({
                formId: $scope.submission.form.id,
                skillId: $scope.submission.skill.id,
                fieldId: field.id,
                personId: person.person.id
            }, person, saved, errored);
            promises.push(fieldUpdate.$promise);
        };
        if (key in timeoutsFieldPersons) {
            $timeout.cancel(timeoutsFieldPersons[key]);
        }
        timeoutsFieldPersons[key] = $timeout(updateField, 1000);
    };

    $scope.fieldPersonDateOfBirthChanged =  function (field, person) {
        if (person.dob.length == 10) {
            $scope.saving = true;
            var dateOfBirth = person.dob.substring(6, 10) + '-' + person.dob.substring(3, 5) + '-' + person.dob.substring(0, 2);
            person.date_of_birth = dateOfBirth;
            var fieldUpdate = FormSubmissionFieldPerson.update({
                formId: $scope.submission.form.id,
                skillId: $scope.submission.skill.id,
                fieldId: field.id,
                personId: person.person.id
            }, person, saved, function (httpResponse) {
                person.dob = '';
                return errored(httpResponse);
            });
            promises.push(fieldUpdate.$promise);
        }
    };

    $scope.personChecked = function (field, person) {
        $scope.saving = true;
        var fieldUpdate = FormSubmissionFieldPerson.update({
            formId: $scope.submission.form.id,
            skillId: $scope.submission.skill.id,
            fieldId: field.id,
            personId: person.person.id
        }, person, saved, errored);
        promises.push(fieldUpdate.$promise);
    };

    $scope.pinChanged = function (field, person) {
        if (person.pin.length == 4) {
            $scope.saving = true;
            var fieldUpdate = FormSubmissionFieldPerson.update({
                formId: $scope.submission.form.id,
                skillId: $scope.submission.skill.id,
                fieldId: field.id,
                personId: person.person.id
            }, person, function (p) {
                person.checked = p.checked;
                if (!person.checked) {
                    person.pin = '';
                }
                saved();
            }, function (httpResponse) {
                person.pin = '';
                return errored(httpResponse);
            });
            promises.push(fieldUpdate.$promise);
        }
    };

    $scope.pinKeypress = function (e) {
        if (e.keyCode === 13) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    $scope.submit = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            if (confirm('Please only submit the form if you have filled out all fields. Click OK to proceed.')) {
                $q.all(angular.extend(promises, timeoutsFields)).then(function() {
                    $scope.submitting = true;
                    $scope.submission.state = 'submitted';
                    $scope.submission.$update(function () {
                        alert.success('The form has been submitted successfully.');
                        $state.go('form_submission_list', {eventId: $scope.submission.skill.event.id, skillId: $scope.submission.skill.id});
                    }, function (response) {
                        $scope.submitting = false;
                        alert.error('There was an error submitting the form.');
                        $('body,html').animate({scrollTop: 0});
                    });
                });
            }
        } else {
            $('body,html').animate({scrollTop: 0});
        }
    };
});

angular.module('skillMgmtApp').controller('FormSubmissionSubmissionsCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, Form, SkillFormSubmission) {

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

angular.module('skillMgmtApp').controller('FormSubmissionSubmissionsSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, auth, Skill, Form, SkillFormSubmission) {

    $scope.loading = true;

    $scope.submission = SkillFormSubmission.get({formId: $stateParams.formId, skillId: $stateParams.skillId, id: $stateParams.id}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

});
