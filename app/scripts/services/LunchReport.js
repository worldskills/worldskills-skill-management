(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchReport', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/members/:memberId/reports/lunch', {
        }, {
        });

    });

})();
