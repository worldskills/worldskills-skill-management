(function() {
    'use strict';

    angular.module('skillMgmtApp').service('LunchGroupRegistration', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/lunch_groups/:groupId/registrations/:registrationId', {}, {
            update: {
                method: 'PUT'
            },
            delete: {
                method: 'DELETE'
            }
        });

    });

})();
