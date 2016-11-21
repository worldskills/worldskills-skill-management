(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SkillTime', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/skill_times/:competitionDayId/:type', {
            competitionDayId: '@competition_day_id',
            type: '@type'
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            },
            event: {
                url: WORLDSKILLS_API_SKILLMAN + '/events/:eventId/skill_times',
                method: 'GET'
            }
        });

    });

})();
