'use strict';

angular.module('skillMgmtApp').controller('ReportSkillHighlights', function ($scope, $rootScope, $state, $stateParams, $window, $q, $uibModal, auth, alert, Event, Skill, SkillItem, CompetitionDay) {

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.loading = true;
    var promises = [];

    $scope.items = SkillItem.publicItems({eventId: $stateParams.eventId}, {});
    promises.push($scope.items.$promise);

    $scope.skills = Skill.query({event: $stateParams.eventId});
    promises.push($scope.skills.$promise);

    $scope.days = CompetitionDay.query({eventId: $stateParams.eventId});
    promises.push($scope.days.$promise);

    $q.all(promises).then(function () {
        
        angular.forEach($scope.items.items, function (item) {
            item.skill = $scope.skills.skills.find(function (skill) {
                return skill.id === item.skill_id;
            });
            item.competitionDay = $scope.days.days.find(function (day) {
                return day.id === item.competition_day_id;
            });
        });

        $scope.loading = false;

    });

});

