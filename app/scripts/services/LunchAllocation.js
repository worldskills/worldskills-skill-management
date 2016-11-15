(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchAllocation', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations', {
            timeline: '@timeline',
            lunchPeriodId: '@lunch_period.id',
            personId: '@person.id'
        }, {
            query: {
                method: 'GET'
            },
            add: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:timeline/:lunchPeriodId/persons/:personId',
            },
            remove: {
                method: 'DELETE',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:timeline/:lunchPeriodId/persons/:personId',
            }
        });

    });

})();
