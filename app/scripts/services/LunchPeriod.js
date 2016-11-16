(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchPeriod', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/lunch_periods/:id', {
            id: '@id',
            eventId: '@event.id'
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
