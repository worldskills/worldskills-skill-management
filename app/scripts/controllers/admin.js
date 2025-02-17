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

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ApproveDocument'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanApproveDocument = true;
            }
        });

        auth.hasUserRole(WORLDSKILLS_API_SKILLMAN_CODE, ['Admin', 'ManageDocument'], $scope.event.entity_id).then(function (hasUserRole) {
            if (hasUserRole) {
                $scope.userCanManageDocument = true;
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

angular.module('skillMgmtApp').controller('AdminEventCompetitionDaysCtrl', function($scope, $stateParams, $timeout, $translate, CompetitionDay) {

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
        $translate('message_confirm_delete_competition_day').then(function (message) {
            if (confirm(message)) {
                var index = $scope.competitionDays.days.indexOf(competitionDay);
                $scope.competitionDays.days.splice(index, 1);
                CompetitionDay.delete({eventId: $stateParams.eventId}, competitionDay);
            }
        });
    };

    $scope.swapDay = function (oldIndex, newIndex) {
        var newDay = $scope.competitionDays.days[oldIndex];
        var oldDay = $scope.competitionDays.days[newIndex];
        $scope.competitionDays.days[newIndex] = newDay;
        $scope.competitionDays.days[oldIndex] = oldDay;
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

angular.module('skillMgmtApp').controller('AdminEventCompetitorNamesCtrl', function($scope, $stateParams, $filter, Event, CompetitionDay, Report, PeoplePerson) {

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

    $scope.missingPin = function (competitor) {
        return competitor.submission.state === 'submitted' && competitor.checked === false;
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

    $scope.exportNameChanges = function () {

        var aoa = [
            [
                'Person ID',
                'Previous Name',
                'New Name',
                'Member',
                'Skill'
            ]
        ];

        var competitors = $filter('filter')($scope.report.reports, $scope.nameMismatch);
        angular.forEach(competitors, function (competitor) {

            var data = [
                competitor.person.id,
                competitor.person.first_name + ' ' + competitor.person.last_name,
                competitor.first_name + ' ' + competitor.last_name,
                competitor.member_name,
                competitor.submission.skill.number + ' ' + competitor.submission.skill.name.text
            ];

            aoa.push(data);
        });

        var workbook = XLSX.utils.book_new();
    
        var worksheet = XLSX.utils.aoa_to_sheet(aoa);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Competitors');

        var now = new Date();
        var filename = $scope.event.code;
        if (filename) {
            filename += '_';
        }
        filename += 'Competitor_name_changes';
        filename += '_' + now.getFullYear() + ('00' + (now.getMonth() + 1)).slice(-2) + ('00' + now.getDate()).slice(-2) + ('00' + now.getHours()).slice(-2) + ('00' + now.getMinutes()).slice(-2) + ('00' + now.getSeconds()).slice(-2);
        filename += '.xlsx';

        XLSX.writeFile(workbook, filename);
    };

    $scope.exportMissing = function () {

        var aoa = [
            [
                'Person ID',
                'Name',
                'Member',
                'Skill'
            ]
        ];

        var competitors = $filter('filter')($scope.report.reports, $scope.missingPin);
        angular.forEach(competitors, function (competitor) {

            var data = [
                competitor.person.id,
                competitor.person.first_name + ' ' + competitor.person.last_name,
                competitor.member_name,
                competitor.submission.skill.number + ' ' + competitor.submission.skill.name.text
            ];

            aoa.push(data);
        });

        var workbook = XLSX.utils.book_new();
    
        var worksheet = XLSX.utils.aoa_to_sheet(aoa);

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Competitors');

        var now = new Date();
        var filename = $scope.event.code;
        if (filename) {
            filename += '_';
        }
        filename += 'Competitor_missing';
        filename += '_' + now.getFullYear() + ('00' + (now.getMonth() + 1)).slice(-2) + ('00' + now.getDate()).slice(-2) + ('00' + now.getHours()).slice(-2) + ('00' + now.getMinutes()).slice(-2) + ('00' + now.getSeconds()).slice(-2);
        filename += '.xlsx';

        XLSX.writeFile(workbook, filename);
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
