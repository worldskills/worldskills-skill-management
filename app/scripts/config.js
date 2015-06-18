(function() {
    'use strict';

    var wsApp = angular.module('skillMgmtApp'); 
    wsApp.constant('WORLDSKILLS_API_SKILLMAN', 'http://localhost:8080/skillman');
    wsApp.constant('WORLDSKILLS_API_AUTH_CODE', 1000);
    wsApp.constant('WORLDSKILLS_CLIENT_ID', '81de4e404d80');
    wsApp.constant('WORLDSKILLS_API_AUTH', 'http://localhost:8080/auth');
    wsApp.constant('WORLDSKILLS_AUTHORIZE_URL', 'http://worldskills-auth.dev/oauth/authorize');

})();
