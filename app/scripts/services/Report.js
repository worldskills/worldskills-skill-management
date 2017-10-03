(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Report', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN, {}, {
            lunchSummary: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/events/:eventId/reports/lunch_summary',
            },
            lunchInWorkshop: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/events/:eventId/reports/lunch_in_workshop',
            },
            competitorNames: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/events/:eventId/reports/competitor_names',
            }
        });

    });

})();
