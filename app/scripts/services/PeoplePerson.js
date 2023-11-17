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
            },
            public: {
                method: 'GET',
                url: WORLDSKILLS_API_PEOPLE + '/public'
            }
        });

    });

})();
