(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentSkill', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:id/skills/:skillId', {
            id: '@id',
            skillId: '@skill.id'
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
