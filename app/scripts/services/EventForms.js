(function() {
    'use strict';

    angular.module('skillMgmtApp').service('EventForms', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/events/:eventId/forms', null);

    });

})();
