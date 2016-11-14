'use strict';

angular.module('skillMgmtApp').controller('LunchGroupListCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, auth, alert, Skill, LunchGroup, LunchGroupPerson, Person) {

    $scope.loading = true;

    $scope.skill = Skill.get({eventId: $stateParams.eventId, id: $stateParams.skillId}, {}, function () {

        auth.user.$promise.then(function () {
            $scope.skills.$promise.then(function () {
                $scope.active.skill = $scope.skill;
            });
        });

        $scope.groups = LunchGroup.query({skillId: $scope.skill.id}, function () {
            $scope.loading = false;
            $scope.competitors = Person.competitors({skillId: $stateParams.skillId});
            $scope.experts = Person.experts({skillId: $stateParams.skillId});
        }, function () {
            // error
            $scope.loading = false;
        });

    });

    $scope.inGroup = function (person) {
        var inGroup = false;
        angular.forEach($scope.groups.groups, function (group) {
            angular.forEach(group.persons, function (p) {
                if (p.id == person.id) {
                    inGroup = true;
                }
            });
        });
        return !inGroup;
    };

    $scope.removePerson = function (group, person) {
        var index = group.persons.indexOf(person);
        LunchGroupPerson.remove({skillId: $stateParams.skillId, groupId: group.id, personId: person.id});
        group.persons.splice(index, 1);
    };

    $scope.addPerson = function (group, person) {
        group.persons.push(person);
        LunchGroupPerson.update({skillId: $stateParams.skillId, groupId: group.id, personId: person.id}, {});
    };

    $scope.addGroup = function (type) {
        var group = {
            name: "New group",
            type: type
        };
        $scope.groups.groups.push(group);
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
    };

    var timeoutsGroups = {};
    $scope.groupChanged = function (group) {
        var updateGroup = function () {
            $scope.saving = true;
            if (group.id) {
                LunchGroup.update({skillId: $scope.skill.id}, group, saved, errored);
            } else {
                LunchGroup.save({skillId: $scope.skill.id}, group, function (response) {
                    group.id = response.id;
                    saved();
                }, errored);
            }
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
