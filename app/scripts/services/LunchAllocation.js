(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchAllocation', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_allocations', {}, {
            query: {
                method: 'GET'
            }
        });

    });

})();
