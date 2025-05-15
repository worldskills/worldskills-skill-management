'use strict';

angular.module('skillMgmtApp').controller('FormSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $q, $timeout, $translate, auth, alert, Upload, WORLDSKILLS_API_SKILLMAN, SMTElectionVote, FormSubmission, FormSubmissionField, FormSubmissionFieldPerson, FormSubmissionFieldFile) {

    $scope.submission = FormSubmission.save({formId: $stateParams.formId, skillId: $stateParams.skillId}, {}, function () {
        if ($scope.submission.state == 'submitted') {
            $translate('message_form_already_submitted').then(function (message) {
                alert.error(message);
                $state.go('form_submission_list', {eventId: $scope.submission.skill.event.id, skillId: $scope.submission.skill.id});
            });
        }
        $scope.loading = false;
        if ($scope.submission.fields[0].text.text == 'Chief Expert (most number of votes)') {
            $scope.votes = SMTElectionVote.query({skillId: $stateParams.skillId}, function () {
                angular.forEach($scope.submission.fields, function (field, i) {
                    var result = $scope.votes.results[i];
                    if (result && i < 6 && field.value == '') {
                        field.value = result.person.person.first_name + ' ' + result.person.person.last_name + ' ' + result.person.member.code + ' (' + result.points + ' points)';
                    }
                    if ($scope.votes.results.length > 0) {
                        field.disabled = true;
                    }
                });
            });
        }
    });

    $scope.saving = false;
    var saved = function () {
        $scope.saving = false;
        $scope.saved = true;
    };

    var errored = function (httpResponse) {
        if (httpResponse.status == 401) {
            // Unauthorized

            $translate('message_error_session_timed_out').then(function (message) {
                window.alert(message);

                // reload page
                window.location.reload(false)
            });

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
        if (e.keyCode === 13) { // prevent enter key
            e.preventDefault();
            e.stopPropagation();
        }
    };

    $scope.submit = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $translate('message_confirm_submit_form_experts').then(function (message) {
                if (confirm(message)) {
                    $q.all(angular.extend(promises, timeoutsFields)).then(function() {
                        $scope.submitting = true;
                        $scope.submission.state = 'submitted';
                        $scope.submission.$update(function () {
                            $translate('message_form_submitted').then(function (message) {
                                alert.success(message);
                                $state.go('form_submission_list', {eventId: $scope.submission.skill.event.id, skillId: $scope.submission.skill.id});
                            });
                        }, function (response) {
                            $scope.submitting = false;
                            $translate('message_error_submitting_form').then(function (message) {
                                alert.error(message);
                                $('body,html').animate({scrollTop: 0});
                            });
                        });
                    });
                }
            });
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
