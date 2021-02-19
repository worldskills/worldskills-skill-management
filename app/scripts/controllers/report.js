'use strict';

angular.module('skillMgmtApp').controller('ReportLunchIndexCtrl', function ($scope, $state, $stateParams, auth, PersonMember) {

    auth.user.$promise.then(function () {

        $scope.members = PersonMember.get({personId: auth.user.person_id, eventId: $stateParams.eventId}, function () {

            if ($scope.members.members.length != 0) {
                $state.go('report_lunch', {eventId: $stateParams.eventId, memberId: $scope.members.members[0].id, day: 'C1'});
            } else {
                $state.go('sorry');
            }

        }, function () {
            $state.go('sorry');
        });
    });
});

angular.module('skillMgmtApp').controller('ReportLunchCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, $uibModal, auth, alert, LunchReport) {

    $scope.loading = true;

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

angular.module('skillMgmtApp').controller('ReportCompetitorFinishCtrl', function($scope, $stateParams, $window, Event, CompetitionDay, Skill, SkillTime) {

    $window.document.title = 'Competitor Finish Times';

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.skills = Skill.query({event: $stateParams.eventId});

    $scope.skillTimes = SkillTime.event({eventId: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('ReportLunchSummaryCtrl', function($scope, $stateParams, $window, Event, CompetitionDay, Report) {

    $window.document.title = 'Lunch Summary';

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.report = Report.lunchSummary({eventId: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('ReportLunchInWorkshopCtrl', function($scope, $stateParams, $window, Event, CompetitionDay, Report) {

    $window.document.title = 'Lunch Summary';

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.report = Report.lunchInWorkshop({eventId: $stateParams.eventId}, function () {

        $scope.competitionDays.$promise.then(function () {

            angular.forEach($scope.report.reports, function (report) {
                angular.forEach($scope.competitionDays.days, function (competitionDay) {
                    if (competitionDay.id == report.competition_day_id) {
                        if (typeof competitionDay.total == 'undefined') {
                            competitionDay.total = 0;
                        }
                        competitionDay.total = competitionDay.total + report.total;
                    }
                });
            });
        });
    });

});
