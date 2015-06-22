(function() {
    'use strict';

    var wsApp = angular.module('skillMgmtApp');
    wsApp.constant('WORLDSKILLS_API_SKILLMAN', 'http://localhost:8080/skillman');
    wsApp.constant('WORLDSKILLS_API_SKILLMAN_CODE', 1200);
    wsApp.constant('WORLDSKILLS_CLIENT_ID', '269f5d211');
    wsApp.constant('WORLDSKILLS_API_AUTH', 'http://localhost:8080/auth');
    wsApp.constant('WORLDSKILLS_AUTHORIZE_URL', 'http://worldskills-auth.dev/oauth/authorize');

})();
