(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchAllocationGroup', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocation_groups', {
            timeline: '@timeline',
            lunchPeriodId: '@lunch_period.id',
            groupId: '@group.id'
        }, {
            query: {
                method: 'GET'
            },
            add: {
                method: 'PUT',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:timeline/:lunchPeriodId/groups/:groupId',
            },
            remove: {
                method: 'DELETE',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations/:timeline/:lunchPeriodId/groups/:groupId',
            }
        });

    });

})();
