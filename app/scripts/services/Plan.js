(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Plan', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/management_plan', {
            skillId: '@skill.id'
        }, {
        });

    });

})();
