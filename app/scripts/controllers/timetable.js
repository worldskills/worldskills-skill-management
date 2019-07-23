'use strict';

angular.module('skillMgmtApp').controller('TimetableIndexCtrl', function ($scope, $state, $stateParams, auth, PersonRegistration) {

    auth.user.$promise.then(function () {

        $scope.registrations = PersonRegistration.get({personId: auth.user.person_id, eventId: $stateParams.eventId}, function () {

            if ($scope.registrations.registrations.length != 0) {
                $state.go('timetable', {eventId: $stateParams.eventId, memberRegPositionId: $scope.registrations.registrations[0].id, day: 'C1'});
            } else {
                $state.go('sorry');
            }

        }, function () {
            $state.go('sorry');
        });
    });
});

angular.module('skillMgmtApp').controller('TimetableCtrl', function ($scope, $rootScope, $state, $stateParams, $window, $timeout, $uibModal, auth, alert, Timetable, PersonRegistration) {

    $scope.loading = true;
    $scope.active.preview = true;

    $window.document.title = 'Competitor Timetable';

    $scope.timetable = Timetable.get({eventId: $stateParams.eventId, memberRegPositionId: $stateParams.memberRegPositionId}, {}, function () {

        $scope.loading = false;

        angular.forEach($scope.timetable.competition_days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });

    });

    $scope.changeDay = function (day) {
        $scope.active.day = day;
        $state.go('.', {day: day.timeline}, {location: 'replace', notify: false});
    };

    auth.user.$promise.then(function () {

        $scope.registrations = PersonRegistration.get({personId: auth.user.person_id, eventId: $stateParams.eventId}, function () {

        }, function () {
            // error
            $scope.loading = false;
        });
    });

    $scope.cancelRegistrationModal = function () {
        $scope.registrationsModal.dismiss('cancel');
    };

    $scope.changeRegistration = function () {
        $scope.registrationsModal = $uibModal.open({
            templateUrl: 'views/timetable_registrations.html',
            size: 'lg',
            scope: $scope,
            animation: false
        });
    };
});
