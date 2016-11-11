(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SkillItem', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/skill_items/:timeline/:id', {
            skillId: '@skill.id',
            timeline: '@timeline',
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            save: {
                method: 'POST'
            },
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });

    });

})();
