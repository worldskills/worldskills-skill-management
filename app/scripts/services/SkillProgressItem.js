(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SkillProgressItem', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/progress_items/:progressItemId', {
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            report: {
                method: 'GET',
                url: WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/progress_items_report',
            },
        });

    });

})();
