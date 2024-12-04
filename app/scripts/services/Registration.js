(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Registration', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN, {
            l: 'en'
        }, {
            competitors: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/registrations/competitors',
            },
            experts: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/registrations/experts',
            },
            scms: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/registrations/scms',
            },
            interpreters: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/registrations/interpreters',
            },
        });

    });

})();
