'use strict';

angular.module('skillMgmtApp').controller('AdminFormListCtrl', function ($scope, $rootScope, $state, $stateParams, $location, Form) {

    $scope.loading = true;

    var filters = {
        eventId: $stateParams.eventId,
        limit: 99
    };

    $scope.forms = Form.query(filters, function (data) {
        $scope.loading = false;
    });
});

angular.module('skillMgmtApp').controller('AdminFormDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $location, $translate, alert, auth, WORLDSKILLS_API_SKILLMAN_CODE, Form, Event) {

    $scope.id = $stateParams.id;

    $scope.model = Form.get({id: $scope.id}, function () {
        $scope.title = $scope.model.name.text;
        if (!$scope.model.description) {
            $scope.model.description = {text: '', lang_code: 'en'};
        }
        if (!$scope.model.title_label) {
            $scope.model.title_label = {text: '', lang_code: 'en'};
        }
    });

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, 'EditForms', $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditForms = true;
            }
        });
    });

    $scope.deleteForm = function() {
        $translate('message_confirm_delete_form').then(function (message) {
            if (window.confirm(message)) {
                $scope.deleteLoading = true;
                $scope.model.$delete(function () {
                    $translate('message_form_deleted').then(function (message) {
                        alert.success(message);
                        $state.go('admin_event.form_list', {eventId: $scope.event.id});
                    });
                });
            }
        });
    };
});

angular.module('skillMgmtApp').controller('AdminFormDetailSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $q, FormField, FormSubmission) {

    $scope.loading = true;

    $scope.submissions = FormSubmission.query({formId: $scope.id, state: 'submitted'}, function () {
        $scope.loading = false;
    });

    $scope.fields = FormField.query({formId: $scope.id});

    $scope.export = function () {

        $scope.loadingExport = true;

        var submissionsPromises = [];

        angular.forEach($scope.submissions.submissions, function (submission) {
            var s = FormSubmission.get({formId: $scope.id, id: submission.id});
            submissionsPromises.push(s.$promise);
        });

        $q.all(submissionsPromises).then(function(submissions) {

            $scope.loadingExport = false;

            var aoa = [
                [
                    'ID',
                    'Submitted',
                    'Title',
                    'Skill Number',
                    'Skill Name'
                ]
            ];
    
            angular.forEach($scope.fields.fields, function (field) {
                aoa[0].push(field.title.text);
            });
    
            angular.forEach(submissions, function (submission) {
                var data = [
                    submission.id,
                    submission.submitted.substring(0, 19),
                    submission.title,
                    submission.skill.number,
                    submission.skill.name.text
                ];
    
                angular.forEach(submission.fields, function (field) {
                    data.push(field.value);
                });
        
                aoa.push(data);
            });
    
            var workbook = XLSX.utils.book_new();
    
            var worksheet = XLSX.utils.aoa_to_sheet(aoa);
    
            XLSX.utils.book_append_sheet(workbook, worksheet, 'submissions');
    
            XLSX.writeFile(workbook, 'submissions.xlsx');
        });
    };
});

angular.module('skillMgmtApp').controller('AdminFormDetailFieldsCtrl', function ($scope, $uibModal, FormField) {

    $scope.loading = true;

    $scope.loadFields = function () {
        $scope.fields = FormField.query({formId: $scope.id}, function () {
            $scope.loading = false;
        });
    };
    $scope.loadFields();

    $scope.addField = function () {
        var maxSort = -1;
        $scope.fields.fields.forEach(function (field) {
            maxSort = Math.max(maxSort, field.sort);
        });
        $scope.field = new FormField();
        $scope.field.sort = maxSort + 1;
        $scope.field.title = {lang_code: 'en', text: ''};
        $scope.field.text = {lang_code: 'en', text: ''};
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/admin_form_detail_field.html',
            controller: 'AdminFormDetailFieldCtrl',
            scope: $scope,
            animation: false
        });
    };

    $scope.editField = function (field) {
        $scope.field = angular.copy(field);
        $scope.fieldModal = $uibModal.open({
            templateUrl: 'views/admin_form_detail_field.html',
            controller: 'AdminFormDetailFieldCtrl',
            scope: $scope,
            animation: false
        });
    };

    $scope.moveFieldUp = function (sort, field) {
        var index = $scope.fields.fields.indexOf(field);
        var newField = $scope.fields.fields[index];
        var oldField = $scope.fields.fields[index - 1];
        $scope.fields.fields[index - 1] = newField;
        $scope.fields.fields[index] = oldField;
        newField.sort = sort - 1;
        oldField.sort = sort;
        FormField.update({formId: $scope.id}, newField);
        FormField.update({formId: $scope.id}, oldField);
    };

    $scope.moveFieldDown = function (sort, field) {
        var index = $scope.fields.fields.indexOf(field);
        var newField = $scope.fields.fields[index];
        var oldField = $scope.fields.fields[index + 1];
        $scope.fields.fields[index + 1] = newField;
        $scope.fields.fields[index] = oldField;
        newField.sort = sort + 1;
        oldField.sort = sort;
        FormField.update({formId: $scope.id}, newField);
        FormField.update({formId: $scope.id}, oldField);
    };

});

angular.module('skillMgmtApp').controller('AdminFormDetailFieldCtrl', function ($scope, $uibModalInstance, $translate, alert, FormField) {

    $scope.submitted = false;

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $scope.loading = true;
            if ($scope.field.id) {
                FormField.update({formId: $scope.id}, $scope.field, function (response) {
                    $scope.loadFields();
                    $translate('message_field_updated').then(function (message) {
                        alert.success(message);
                        $uibModalInstance.close();
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            } else {
                FormField.save({formId: $scope.id}, $scope.field, function (response) {
                    $scope.loadFields();
                    $translate('message_field_created').then(function (message) {
                        alert.success(message);
                        $uibModalInstance.close();
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        }
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    $scope.delete = function () {
        FormField.delete({formId: $scope.id}, $scope.field, function () {
            $scope.loadFields();
            $translate('message_field_deleted').then(function (message) {
                alert.success(message);
                $uibModalInstance.close();
            });
        }, function (httpResponse) {
            window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
        });
    };
});

angular.module('skillMgmtApp').controller('AdminFormDetailFormCtrl', function ($scope, $state, $stateParams, $translate, alert, Form, CompetitionDay) {

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.save = function () {
        $scope.submitted = true;
        if ($scope.form.$valid) {
            $scope.loading = true;
            if ($scope.model.competition_day && !$scope.model.competition_day.id) {
                $scope.model.competition_day = null;
            }
            if ($scope.model.id) {
                Form.update($scope.model, function (response) {
                    $translate('message_form_updated').then(function (message) {
                        alert.success(message);
                        $state.go('admin_event.form_list', {eventId: $scope.event.id});
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            } else {
                Form.save($scope.model, function (response) {
                    $translate('message_form_created').then(function (message) {
                        alert.success(message);
                        $state.go('admin_form_detail.fields', {eventId: $scope.event.id, id: response.id});
                    });
                }, function (httpResponse) {
                    window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
                });
            }
        }
    };
});

angular.module('skillMgmtApp').controller('AdminFormDetailPreviewCtrl', function ($scope, FormField) {

    $scope.loading = true;

    $scope.fields = FormField.query({formId: $scope.id}, function () {
        $scope.loading = false;
    });

});

angular.module('skillMgmtApp').controller('AdminSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, $translate, auth, alert, FormSubmission, WORLDSKILLS_API_SKILLMAN_CODE) {

    $scope.loading = true;

    $scope.formId = $stateParams.formId;
    $scope.id = $stateParams.id;

    $scope.submission = FormSubmission.get({formId: $scope.formId, id: $scope.id}, function () {
        $scope.loading = false;
    });

    $scope.rejectSubmission = function () {
        $translate('message_confirm_reject_submission').then(function (message) {
            if (window.confirm(message)) {
                $scope.rejectLoading = true;
                $scope.submission.$reject(function () {
                    $scope.rejectLoading = false;
                    $translate('message_submission_rejected').then(function (message) {
                        alert.success(message);
                        $state.go('admin_form_detail.submissions', {eventId: $stateParams.eventId, id: $scope.formId});
                    });
                }, function (response) {
                    $scope.rejectLoading = false;
                    $translate('message_submission_rejected_error').then(function (message) {
                        alert.error(message);
                    });
                });
            }
        });
    };

    $scope.downloadFiles = function (files) {
        angular.forEach(files, function (file) {
            window.open(file.download);
        });
    };

    auth.user.$promise.then(function () {

        angular.forEach(auth.user.roles, function (role) {

            if (role.name == 'Admin' && role.role_application.application_code == WORLDSKILLS_API_SKILLMAN_CODE)
            {
                $scope.userCanRejectAllSubmissions = true;
            }

            if (role.name == 'RejectAllSubmissions' && role.role_application.application_code == WORLDSKILLS_API_SKILLMAN_CODE)
            {
                $scope.userCanRejectAllSubmissions = true;
            }
        });
    });
});

angular.module('skillMgmtApp').controller('AdminFormCreateCtrl', function ($scope, $rootScope, $state, $stateParams, $location, Form, Event) {

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        $scope.model = new Form();
        $scope.model.event = $scope.event;
        $scope.model.name = {text: '', lang_code: 'en'};
        $scope.model.description = {text: '', lang_code: 'en'};
        $scope.model.title_label = {text: '', lang_code: 'en'};
    });

    $scope.forms = Form.query({eventId: $stateParams.eventId, limit: 99}, function (data) {
        var maxSort = -1;
        $scope.forms.forms.forEach(function (form) {
            maxSort = Math.max(maxSort, form.sort);
        });
        $scope.model.sort = maxSort + 1;
    });
});

angular.module('skillMgmtApp').controller('AdminFormProgressCtrl', function($scope, $stateParams, $q, Form, FormSubmission, Event, Skill) {

    $scope.loading = true;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.skills = Skill.query({event: $stateParams.eventId}, function () {

        angular.forEach($scope.skills.skills, function (skill) {
            skill.submissions = {};
        });

        $scope.forms = Form.query({eventId: $stateParams.eventId, multiple_submissions: false, limit: 99}, function () {

            var submissionsPromises = [];

            angular.forEach($scope.forms.forms, function (form) {
                var s = FormSubmission.query({formId: form.id}, function (submissions) {
                    angular.forEach(submissions.submissions, function (submission) {
                        angular.forEach($scope.skills.skills, function (skill) {
                            if (skill.id == submission.skill.id) {
                                skill.submissions[form.id] = submission;
                            }
                        });
                    });
                });
                submissionsPromises.push(s.$promise);
            });

            $q.all(submissionsPromises).then(function() {
                $scope.loading = false;
            });
        });

    });
});
