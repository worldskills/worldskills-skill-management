(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Person', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN, {
        }, {
            competitors: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/competitors',
            },
            experts: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/experts',
            }
        });

    });

})();
