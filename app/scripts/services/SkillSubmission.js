(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SkillSubmission', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/submissions', {
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
