(function() {
    'use strict';

    angular.module('skillMgmtApp').service('PeoplePerson', function ($resource, WORLDSKILLS_API_PEOPLE) {

        return $resource(WORLDSKILLS_API_PEOPLE + '/person/:id', {
            id: '@id'
        }, {
            query: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            }
        });

    });

})();
