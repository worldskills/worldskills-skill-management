(function() {
    'use strict';

    angular.module('skillMgmtApp').service('PersonSkills', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/people/:personId/skills', null);

    });

})();
