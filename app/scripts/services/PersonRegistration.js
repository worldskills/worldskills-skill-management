(function() {
    'use strict';

    angular.module('skillMgmtApp').service('PersonRegistration', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/people/:personId/events/:eventId/registrations/competitors', null);

    });

})();
