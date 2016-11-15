'use strict';

angular.module('skillMgmtApp').controller('AdminEventItemsCtrl', function ($scope, $rootScope, $state, $stateParams, $location, $timeout, CompetitionDay, CompetitionItem, Room) {

    $scope.loading = true;

    $scope.activeDay = $stateParams.day;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId}, function () {

        angular.forEach($scope.competitionDays.days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });
    });

    $scope.rooms = Room.query({eventId: $stateParams.eventId}, {});

    $scope.items = CompetitionItem.query({eventId: $stateParams.eventId}, {}, function () {
        $scope.loading = false;
    });

    $scope.changeDay = function (day) {
        $scope.active.day = day;
        $state.go('.', {day: day.timeline}, {notify: false});
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

    var timeoutsItems = {};
    $scope.itemChanged = function (item) {
        var updateItem = function () {
            $scope.saving = true;
            if (item.id) {
                CompetitionItem.update({eventId: $stateParams.eventId}, item, saved, errored);
            } else {
                CompetitionItem.save({eventId: $stateParams.eventId}, item, function (response) {
                    item.id = response.id;
                    saved();
                }, errored);
            }
        };
        if (item.id in timeoutsItems) {
            $timeout.cancel(timeoutsItems[item.id]);
        }
        timeoutsItems[item.id] = $timeout(updateItem, 1000);
    };

    $scope.addItem = function () {
        var newItem = {
            timeline: $scope.active.day.timeline,
            name: {
                lang_code: 'en',
                text: ''
            },
            description: {
                lang_code: 'en',
                text: ''
            }
        };
        $scope.items.items.push(newItem);
    };

    $scope.removeItem = function (item) {
        var index = $scope.items.items.indexOf(item);
        $scope.items.items.splice(index, 1);
        CompetitionItem.delete({eventId: $stateParams.eventId}, item);
    };
});
