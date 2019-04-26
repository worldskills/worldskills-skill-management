(function() {
    'use strict';

    angular.module('skillMgmtApp').service('ExpertSkills', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/experts/:personId/skills', null);

    });

})();
