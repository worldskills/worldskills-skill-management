'use strict';

angular.module('skillMgmtApp').controller('LunchCtrl', function ($scope, $rootScope, $state, $stateParams, $timeout, $uibModal, auth, alert, Skill, LunchPeriod, LunchAllocation, LunchGroup, CompetitionDay, Registration) {

    $scope.loading = true;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId}, function () {

        $scope.lunchAllocations = LunchAllocation.query({skillId: $stateParams.skillId}, function () {
            $scope.loading = false;
        }, function () {
            // error
            $scope.loading = false;
        });

    });

    $scope.skill = Skill.get({id: $stateParams.skillId}, {}, function () {

        $scope.active.skill = $scope.skill;

    });

    $scope.lunchPeriods = LunchPeriod.query({eventId: $stateParams.eventId});

    $scope.competitors = Registration.competitors({skillId: $stateParams.skillId});
    $scope.experts = Registration.experts({skillId: $stateParams.skillId});
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

    $scope.inAssociation = function (registration) {
        var inAssociation = false;
        angular.forEach($scope.lunchAllocations.allocations, function (allocation) {
            if (allocation.competition_day_id == $scope.active.day.id && registration.id == allocation.registration.id) {
                inAssociation = true;
            }
        });
        return !inAssociation;
    };

    $scope.inAssociationGroupCompetitor = function (group) {
        var inAssociation = false;
        if (group.type !== 'COMPETITOR') {
            inAssociation = true;
        }
        angular.forEach($scope.lunchAllocations.groups, function (allocation) {
            if (allocation.competition_day_id == $scope.active.day.id && group.id == allocation.group.id) {
                inAssociation = true;
            }
        });
        return !inAssociation;
    };

    $scope.inAssociationGroupExpert = function (group) {
        var inAssociation = false;
        if (group.type !== 'EXPERT') {
            inAssociation = true;
        }
        angular.forEach($scope.lunchAllocations.groups, function (allocation) {
            if (allocation.competition_day_id == $scope.active.day.id && group.id == allocation.group.id) {
                inAssociation = true;
            }
        });
        return !inAssociation;
    };

    $scope.addGroup = function (lunchPeriod, group) {
        var allocation = {
            lunch_period: lunchPeriod,
            group: group,
            competition_day_id: $scope.active.day.id,
            in_workshop: false
        };
        $scope.lunchAllocations.groups.push(allocation);
        LunchAllocationGroup.add({skillId: $stateParams.skillId}, allocation);
    };

    $scope.removeGroup = function (allocation) {
        var index = $scope.lunchAllocations.groups.indexOf(allocation);
        LunchAllocationGroup.remove({skillId: $stateParams.skillId}, allocation);
        $scope.lunchAllocations.groups.splice(index, 1);
    };

    $scope.addRegistration = function (lunchPeriod, registration, type) {
        var allocation = {
            lunch_period: lunchPeriod,
            registration: registration,
            competition_day_id: $scope.active.day.id,
            type: type,
            in_workshop: false
        };
        $scope.lunchAllocations.allocations.push(allocation);
        LunchAllocation.add({skillId: $stateParams.skillId}, allocation);
    };

    $scope.removeAllocation = function (allocation) {
        var index = $scope.lunchAllocations.allocations.indexOf(allocation);
        LunchAllocation.remove({skillId: $stateParams.skillId}, allocation);
        $scope.lunchAllocations.allocations.splice(index, 1);
    };

    $scope.addAllCompetitors = function (lunchPeriod) {
        angular.forEach($scope.competitors.registrations, function (registration) {
            if ($scope.inAssociation(registration)) {
                $scope.addRegistration(lunchPeriod, registration, 'COMPETITOR');
            }
        });
    };

    $scope.addAllExperts = function (lunchPeriod) {
        angular.forEach($scope.experts.registrations, function (registration) {
            if ($scope.inAssociation(registration)) {
                $scope.addRegistration(lunchPeriod, registration, 'EXPERT');
            }
        });
    };

    $scope.lunchInWorkshopAll = function (lunchPeriod, type, inWorkshop) {
        angular.forEach($scope.lunchAllocations.allocations, function (allocation) {
            if (allocation.competition_day_id == $scope.active.day.id && allocation.lunch_period.id == lunchPeriod.id && allocation.type == type) {
                allocation.in_workshop = inWorkshop;
                $scope.lunchInWorkshopChanged(allocation);
            }
        });
        angular.forEach($scope.lunchAllocations.groups, function (allocation) {
            if (allocation.competition_day_id == $scope.active.day.id && group.lunch_period.id == lunchPeriod.id && group.group.type == type) {
                allocation.in_workshop = inWorkshop;
                $scope.lunchInWorkshopChanged(allocation);
            }
        });
    };

    $scope.lunchInWorkshopChanged = function (allocation) {
        LunchAllocation.add({skillId: $stateParams.skillId}, allocation);
    };

    $scope.lunchInWorkshopGroupChanged = function (allocation) {
        LunchAllocationGroup.add({skillId: $stateParams.skillId}, allocation);
    };
});
