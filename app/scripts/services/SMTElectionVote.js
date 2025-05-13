(function() {
    'use strict';

    angular.module('skillMgmtApp').service('SMTElectionVote', function ($resource, WORLDSKILLS_API_SKILLMAN) {

        return $resource(WORLDSKILLS_API_SKILLMAN + '/skills/:skillId/smt_election_votes/:voterId', {
        }, {
            get: {
                method: 'GET'
            },
            update: {
                method: 'PUT'
            }
        });

    });

})();
