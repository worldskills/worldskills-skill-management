(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchGroup', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_groups/:id', {
            id: '@id',
            skillId: '@skill.id',
            l: 'en'
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
