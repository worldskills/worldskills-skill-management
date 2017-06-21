(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Timetable', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/timetable/:memberRegPositionId', {
        }, {
        });

    });

})();
