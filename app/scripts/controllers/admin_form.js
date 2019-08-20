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

angular.module('skillMgmtApp').controller('AdminFormDetailCtrl', function ($scope, $rootScope, $state, $stateParams, $location, Form, Event) {

    $scope.id = $stateParams.id;

    $scope.model = Form.get({id: $scope.id}, function () {
        $scope.title = $scope.model.name.text;
        if (!$scope.model.description) {
            $scope.model.description = {text: '', lang_code: 'en'};
        }
    });

    $scope.event = Event.get({id: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('AdminFormDetailSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, FormSubmission) {

    $scope.loading = true;

    $scope.submissions = FormSubmission.query({formId: $scope.id, state: 'submitted'}, function () {
        $scope.loading = false;
    });
});

angular.module('skillMgmtApp').controller('AdminSubmissionCtrl', function ($scope, $rootScope, $state, $stateParams, auth, alert, FormSubmission, WORLDSKILLS_API_SKILLMAN_CODE) {

    $scope.loading = true;

    $scope.formId = $stateParams.formId;
    $scope.id = $stateParams.id;

    $scope.submission = FormSubmission.get({formId: $scope.formId, id: $scope.id}, function () {
        $scope.loading = false;
    });

    $scope.rejectSubmission = function () {
        if (confirm('Rejecting a submission will show the form to the Chief Expert for editing again. Click OK to proceed.')) {
            $scope.rejectLoading = true;
            $scope.submission.$reject(function () {
                $scope.rejectLoading = false;
                alert.success('The submission has been rejected.');
                $state.go('admin_form_detail.submissions', {eventId: $stateParams.eventId, id: $scope.formId});
            }, function (response) {
                $scope.rejectLoading = false;
                alert.error('There was an error rejecting the form.');
            });
        }
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
