(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchSite', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:timeline/:lunchPeriodId/site/:personType', {}, {
            update: {
                method: 'PUT'
            }
        });

    });

})();
