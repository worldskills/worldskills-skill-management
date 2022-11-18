'use strict';

angular.module('skillMgmtApp').controller('AdminCtrl', function($scope, $stateParams, Event) {

    $scope.loading = true;

    $scope.events = Event.query({type: 'competition', ws_entity: 1}, function () {
        $scope.loading = false;
    });
});

angular.module('skillMgmtApp').controller('AdminEventCtrl', function($scope, $stateParams, WORLDSKILLS_API_SKILLMAN_CODE, auth, Event) {

    $scope.event = Event.get({id: $stateParams.eventId}, function () {

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditCompetitionItems'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditCompetitionItems = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditLunchPeriods'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditLunchPeriods = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditCompetitionDays'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditCompetitionDays = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'EditRooms'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanEditRooms = true;
            }
        });

    });

});

angular.module('skillMgmtApp').controller('AdminEventSkillsCtrl', function($scope, $state, $stateParams, $q, alert, Skill, SkillExpert, Poll) {

    $scope.skills = Skill.query({event: $stateParams.eventId}, function () {

    });

});

angular.module('skillMgmtApp').controller('AdminEventRoomsCtrl', function($scope, $stateParams, $timeout, Room) {

    $scope.rooms = Room.query({eventId: $stateParams.eventId});

    var timeoutsRooms = {};
    $scope.roomChanged = function (room) {
        var updateRoom = function () {
            if (room.id) {
                Room.update({eventId: $stateParams.eventId}, room);
            } else {
                Room.save({eventId: $stateParams.eventId}, room, function (response) {
                    room.id = response.id;
                });
            }
        };
        if (room.id in timeoutsRooms) {
            $timeout.cancel(timeoutsRooms[room.id]);
        }
        timeoutsRooms[room.id] = $timeout(updateRoom, 1000);
    };

    $scope.addRoom = function () {
        var room = {
            name: {
                lang_code: 'en',
                text: ''
            }
        };
        $scope.rooms.rooms.push(room);
    };

    $scope.removeRoom = function (room) {
        var index = $scope.rooms.rooms.indexOf(room);
        $scope.rooms.rooms.splice(index, 1);
        Room.delete({eventId: $stateParams.eventId}, room);
    };
});

angular.module('skillMgmtApp').controller('AdminEventLunchPeriodsCtrl', function($scope, $stateParams, $timeout, LunchPeriod) {

    $scope.lunchPeriods = LunchPeriod.query({eventId: $stateParams.eventId});

    var timeoutsLunchPeriods = {};
    $scope.lunchPeriodChanged = function (lunchPeriod) {
        var updateLunchPeriod = function () {
            if (lunchPeriod.id) {
                LunchPeriod.update({eventId: $stateParams.eventId}, lunchPeriod);
            } else {
                LunchPeriod.save({eventId: $stateParams.eventId}, lunchPeriod, function (response) {
                    lunchPeriod.id = response.id;
                });
            }
        };
        if (lunchPeriod.id in timeoutsLunchPeriods) {
            $timeout.cancel(timeoutsLunchPeriods[lunchPeriod.id]);
        }
        timeoutsLunchPeriods[lunchPeriod.id] = $timeout(updateLunchPeriod, 1000);
    };

    $scope.addLunchPeriod = function () {
        $scope.lunchPeriods.lunch_periods.push({});
    };

    $scope.removeLunchPeriod = function (lunchPeriod) {
        var index = $scope.lunchPeriods.lunch_periods.indexOf(lunchPeriod);
        $scope.lunchPeriods.lunch_periods.splice(index, 1);
        LunchPeriod.delete({eventId: $stateParams.eventId}, lunchPeriod);
    };
});

angular.module('skillMgmtApp').controller('AdminEventCompetitionDaysCtrl', function($scope, $stateParams, $timeout, CompetitionDay) {

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.competitionDayChanged = function (competitionDay) {
        var updateCompetitionDay = function () {
            if (competitionDay.id) {
                CompetitionDay.update({eventId: $stateParams.eventId}, competitionDay);
            } else {
                CompetitionDay.save({eventId: $stateParams.eventId}, competitionDay, function (response) {
                    competitionDay.id = response.id;
                });
            }
        };
        if (competitionDay.$timeout) {
            $timeout.cancel(competitionDay.$timeout);
        }
        competitionDay.$timeout = $timeout(updateCompetitionDay, 1000);
    };

    $scope.addCompetitionDay = function () {
        var maxSort = 0;
        $scope.competitionDays.days.forEach(function (day) {
            maxSort = Math.max(maxSort, day.sort);
        });
        $scope.competitionDays.days.push({sort: maxSort + 1});
    };

    $scope.removeCompetitionDay = function (competitionDay) {
        if (confirm('Deleting the Competition Day will also delete all Competition and Skill Items as well as all Lunch Allocations for this day. Click OK to proceed.')) {
            var index = $scope.competitionDays.days.indexOf(competitionDay);
            $scope.competitionDays.days.splice(index, 1);
            CompetitionDay.delete({eventId: $stateParams.eventId}, competitionDay);
        }
    };

    $scope.moveDayUp = function (index) {
        var newDay = $scope.competitionDays.days[index];
        var oldDay = $scope.competitionDays.days[index - 1];
        $scope.competitionDays.days[index - 1] = newDay;
        $scope.competitionDays.days[index] = oldDay;
        var sort = newDay.sort;
        newDay.sort = oldDay.sort;
        oldDay.sort = sort;
        CompetitionDay.update({eventId: $stateParams.eventId}, newDay);
        CompetitionDay.update({eventId: $stateParams.eventId}, oldDay);
    };

    $scope.moveDayDown = function (index) {
        var newDay = $scope.competitionDays.days[index];
        var oldDay = $scope.competitionDays.days[index + 1];
        $scope.competitionDays.days[index + 1] = newDay;
        $scope.competitionDays.days[index] = oldDay;
        var sort = newDay.sort;
        newDay.sort = oldDay.sort;
        oldDay.sort = sort;
        CompetitionDay.update({eventId: $stateParams.eventId}, newDay);
        CompetitionDay.update({eventId: $stateParams.eventId}, oldDay);
    };

});

angular.module('skillMgmtApp').controller('AdminEventAdvancedCtrl', function($scope, $stateParams, Event) {

    $scope.lockEvent = function () {
        $scope.event = Event.lock($scope.event);
    };
});

angular.module('skillMgmtApp').controller('AdminEventCompetitorNamesCtrl', function($scope, $stateParams, $timeout, Event, CompetitionDay, Report, PeoplePerson) {

    $scope.loading = true;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.report = Report.competitors({eventId: $stateParams.eventId}, function () {
        $scope.loading = false;
    });

    $scope.nameMismatch = function (competitor) {
        var empty = competitor.first_name && competitor.last_name;
        var firstName = competitor.first_name != competitor.person.first_name;
        var lastName = competitor.last_name != competitor.person.last_name;
        return empty && (firstName || lastName);
    };

    $scope.overwritePeople = function (competitor) {
        competitor.loading = true;
        PeoplePerson.get({id: competitor.person.id}, function (person) {
            person.first_name = competitor.first_name;
            person.last_name = competitor.last_name;
            person.$update(function (person) {
                competitor.person = person;
            }, function (httpResponse) {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            });
        });
    };
});

angular.module('skillMgmtApp').controller('AdminEventCompetitorDateOfBirthCtrl', function($scope, $stateParams, $timeout, Event, CompetitionDay, Report, PeoplePerson) {

    $scope.loading = true;

    $scope.event = Event.get({id: $stateParams.eventId});

    $scope.competitionDays = CompetitionDay.query({eventId: $stateParams.eventId});

    $scope.report = Report.competitors({eventId: $stateParams.eventId}, function () {
        $scope.loading = false;
    });

    $scope.dateOfBirthMismatch = function (competitor) {
        return competitor.date_of_birth != competitor.person.date_of_birth;
    };

    $scope.overwritePeople = function (competitor) {
        competitor.loading = true;
        PeoplePerson.get({id: competitor.person.id}, function (person) {
            person.date_of_birth = competitor.date_of_birth;
            person.$update(function (person) {
                competitor.person = person;
            }, function (httpResponse) {
                window.alert('An error has occured: ' + JSON.stringify(httpResponse.data));
            });
        });
    };

});
