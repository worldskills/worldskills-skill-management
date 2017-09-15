'use strict';

angular.module('skillMgmtApp').controller('LunchReportIndexCtrl', function ($scope, $state, $stateParams, auth, PersonMember) {

    auth.user.$promise.then(function () {

        $scope.members = PersonMember.get({personId: auth.user.person_id, eventId: $stateParams.eventId}, function () {

            if ($scope.members.members.length != 0) {
                $state.go('lunch_report', {eventId: $stateParams.eventId, memberId: $scope.members.members[0].id, day: 'C1'});
            } else {
                $state.go('sorry');
            }

        }, function () {
            $state.go('sorry');
        });
    });
});

angular.module('skillMgmtApp').controller('LunchReportCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, $uibModal, auth, alert, LunchReport) {

    $scope.loading = true;
    $scope.active.preview = true;

    $window.document.title = 'Lunch Times';

    $scope.lunchReport = LunchReport.get({eventId: $stateParams.eventId, memberId: $stateParams.memberId}, {}, function () {

        $scope.loading = false;

        angular.forEach($scope.lunchReport.competition_days, function (competitionDay) {
            console.log(competitionDay.timeline, $stateParams.day, competitionDay.timeline == $stateParams.day);
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });

    });

    $scope.changeDay = function (day) {
        $scope.active.day = day;
        $state.go('.', {day: day.timeline}, {location: 'replace', notify: false});
    };
});
