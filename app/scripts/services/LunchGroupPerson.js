(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchGroupPerson', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_groups/:groupId/persons/:personId', {}, {
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });

    });

})();
