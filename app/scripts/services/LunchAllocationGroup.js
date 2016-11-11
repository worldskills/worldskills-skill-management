(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchAllocationGroup', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocation_groups', {}, {
            query: {
                method: 'GET'
            }
        });

    });

})();
