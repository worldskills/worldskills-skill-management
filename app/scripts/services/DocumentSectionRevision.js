(function() {
    'use strict';

    angular.module('skillMgmtApp').service('DocumentSectionRevision', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/documents/:documentId/revisions/:id', {
            documentId: '@document.id',
            id: '@id'
        }, {
            query: {
                method: 'GET'
            }
        });

    });

})();
