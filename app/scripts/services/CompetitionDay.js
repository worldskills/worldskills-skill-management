(function() {
    'use strict';

    angular.module('skillMgmtApp').service('CompetitionDay', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/competition_days/:id', {
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
