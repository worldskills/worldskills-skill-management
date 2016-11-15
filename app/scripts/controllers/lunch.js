'use strict';

angular.module('skillMgmtApp').controller('LunchCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, auth, alert, Skill, LunchPeriod, LunchAllocation, LunchGroup, CompetitionDay, Person) {

    $scope.loading = true;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.skill = Skill.get({eventId: $stateParams.eventId, id: $stateParams.skillId}, {}, function () {

        auth.user.$promise.then(function () {
            $scope.skills.$promise.then(function () {
                $scope.active.skill = $scope.skill;
            });
        });

    });

    $scope.lunchPeriods = LunchPeriod.query({eventId: $stateParams.eventId}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

    $scope.lunchAllocations = LunchAllocation.query({skillId: $stateParams.skillId}, function () {
        $scope.loading = false;
    }, function () {
        // error
        $scope.loading = false;
    });

    $scope.competitors = Person.competitors({skillId: $stateParams.skillId});
    $scope.experts = Person.experts({skillId: $stateParams.skillId});
    $scope.lunchGroups = LunchGroup.query({skillId: $stateParams.skillId});

    $scope.cancelSkillsModal = function () {
        $scope.skillsModal.dismiss('cancel');
    };

    $scope.changeSkill = function () {
        $scope.skillsModal = $uibModal.open({
            templateUrl: 'views/lunch_skills.html',
            size: 'sm',
            scope: $scope
        });
    };

});

angular.module('skillMgmtApp').controller('LunchDayCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, auth, alert, LunchAllocationGroup, LunchAllocation) {

    $scope.competitionDays.$promise.then(function () {
        angular.forEach($scope.competitionDays.days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });
    });

    $scope.inAssociation = function (person) {
        var inAssociation = false;
        angular.forEach($scope.lunchAllocations.allocations, function (allocation) {
            if (allocation.timeline == $scope.active.day.timeline && person.id == allocation.person.id) {
                inAssociation = true;
            }
        });
        return !inAssociation;
    };

    $scope.addGroup = function (lunchPeriod, group) {
        var allocation = {
            lunch_period: lunchPeriod,
            group: group,
            timeline: $scope.active.day.timeline
        };
        $scope.lunchAllocations.groups.push(allocation);
        LunchAllocationGroup.add({skillId: $stateParams.skillId}, allocation);
    };

    $scope.removeGroup = function (allocation) {
        var index = $scope.lunchAllocations.groups.indexOf(allocation);
        LunchAllocationGroup.remove({skillId: $stateParams.skillId}, allocation);
        $scope.lunchAllocations.groups.splice(index, 1);
    };

    $scope.addPerson = function (lunchPeriod, person, type) {
        var allocation = {
            lunch_period: lunchPeriod,
            person: person,
            timeline: $scope.active.day.timeline,
            type: type
        };
        $scope.lunchAllocations.allocations.push(allocation);
        LunchAllocation.add({skillId: $stateParams.skillId}, allocation);
    };

    $scope.removePerson = function (allocation) {
        var index = $scope.lunchAllocations.allocations.indexOf(allocation);
        LunchAllocation.remove({skillId: $stateParams.skillId}, allocation);
        $scope.lunchAllocations.allocations.splice(index, 1);
    };
});
