(function() {
    'use strict';

    angular.module('skillMgmtApp').service('CompetitionItem', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/competition_items/:id', {
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
