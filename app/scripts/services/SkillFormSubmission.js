(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SkillFormSubmission', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/forms/:formId/skills/:skillId/submissions/:id', {
            id: '@id',
            formId: '@form.id',
            skillId: '@skill.id'
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
