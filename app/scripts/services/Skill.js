(function() {
    'use strict';

    angular.module('skillMgmtApp').service('Skill', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/skills/:id', {
            eventId: '@event.id',
            id: '@id'
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
