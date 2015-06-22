(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SkillForms', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/forms', null);

    });

})();
