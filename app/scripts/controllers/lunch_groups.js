'use strict';

angular.module('skillMgmtApp').controller('LunchGroupListCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, $translate, auth, alert, Skill, LunchGroup, LunchGroupRegistration, Registration) {

    $scope.loading = true;

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

        $scope.active.skill = $scope.skill;

        $scope.groups = LunchGroup.query({skillId: $scope.skill.id}, function () {
            $scope.loading = false;
            $scope.competitors = Registration.competitors({skillId: $stateParams.skillId});
            $scope.experts = Registration.experts({skillId: $stateParams.skillId});
        }, function () {
            // error
            $scope.loading = false;
        });

    });

    $scope.inGroup = function (registration) {
        var inGroup = false;
        angular.forEach($scope.groups.groups, function (group) {
            angular.forEach(group.registrations, function (r) {
                if (r.id == registration.id) {
                    inGroup = true;
                }
            });
        });
        return !inGroup;
    };

    $scope.removeRegistration = function (group, registration) {
        var index = group.registrations.indexOf(registration);
        LunchGroupRegistration.remove({skillId: $stateParams.skillId, groupId: group.id, registrationId: registration.id});
        group.registrations.splice(index, 1);
    };

    $scope.addRegistration = function (group, registration) {
        group.registrations.push(registration);
        LunchGroupRegistration.update({skillId: $stateParams.skillId, groupId: group.id, registrationId: registration.id}, {});
    };

    $scope.addGroup = function (type) {
        var group = {
            name: "New group",
            type: type,
            registrations: []
        };
        LunchGroup.save({skillId: $scope.skill.id}, group, function (response) {
            $scope.groups.groups.push(response);
        }, errored);
    };

    $scope.deleteGroup = function (group) {
        var index = $scope.groups.groups.indexOf(group);
        LunchGroup.remove({skillId: $scope.skill.id, id: group.id});
        $scope.groups.groups.splice(index, 1);
    };

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
                window.location.reload(false);
            });

        } else {
            if (httpResponse.data.user_msg) {
                window.alert('Error: ' + httpResponse.data.user_msg);
            } else {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            }
        }
        $scope.saving = false;
    };

    var timeoutsGroups = {};
    $scope.groupChanged = function (group) {
        var updateGroup = function () {
            $scope.saving = true;
            LunchGroup.update({skillId: $scope.skill.id}, group, saved, errored);
        };
        if (group.id in timeoutsGroups) {
            $timeout.cancel(timeoutsGroups[group.id]);
        }
        timeoutsGroups[group.id] = $timeout(updateGroup, 1000);
    };

    $scope.cancelSkillsModal = function () {
        $scope.skillsModal.dismiss('cancel');
    };

    $scope.changeSkill = function () {
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/lunch_group_list_skills.html',
            size: 'sm',
            scope: $scope
        });
    };
});
