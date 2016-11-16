'use strict';

angular.module('skillMgmtApp').controller('AdminCtrl', function($scope, $stateParams, Event) {

    $scope.loading = true;

    $scope.events = Event.query({type: 'competition', ws_entity: 1}, function () {
        $scope.loading = false;
    });
});

angular.module('skillMgmtApp').controller('AdminEventCtrl', function($scope, $stateParams, Event) {

    $scope.event = Event.get({id: $stateParams.eventId});

});

angular.module('skillMgmtApp').controller('AdminEventSkillsCtrl', function($scope, $stateParams, Skill) {

    $scope.skills = Skill.query({eventId: $stateParams.eventId});

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
