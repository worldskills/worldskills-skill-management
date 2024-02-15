'use strict';

angular.module('skillMgmtApp').controller('AdminEventItemsCtrl', function ($scope, $rootScope, $state, $stateParams, $location, $timeout, CompetitionDay, CompetitionItem, Room) {

    $scope.loading = true;

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId}, function () {

        angular.forEach($scope.competitionDays.days, function (competitionDay) {
            if (competitionDay.timeline == $stateParams.day) {
                $scope.active.day = competitionDay;
            }
        });

        $scope.items = CompetitionItem.query({eventId: $stateParams.eventId}, {}, function () {

            $scope.loading = false;

            angular.forEach($scope.items.items, function (item) {
                if (item.start_time) {
                    item.start_time = item.start_time.substring(0, 5);
                }
                if (item.end_time) {
                    item.end_time = item.end_time.substring(0, 5);
                }
            });
        });
    });

    $scope.rooms = Room.query({eventId: $stateParams.eventId}, {});

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
        var parseTime = function (item, key) {
            if (item[key]) {
                item[key] = item[key].replace('.', ':');
                item[key] = item[key].replace('h', ':');
                if (item[key].length === 4 && item[key].charAt(1) === ':') {
                    item[key] = '0' + item[key];
                }
                var matches = item[key].match(/^([0-1][0-9]|2[0-3]):?([0-5][0-9])$/);
                if (matches !== null) {
                    item[key] = matches[1] + ':' + matches[2];
                }
            }
        }
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
        parseTime(item, 'start_time');
        parseTime(item, 'end_time');
        if (item.id in timeoutsItems) {
            $timeout.cancel(timeoutsItems[item.id]);
        }
        timeoutsItems[item.id] = $timeout(updateItem, 1000);
    };

    $scope.addItem = function () {
        var newItem = {
            competition_day_id: $scope.active.day.id,
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
