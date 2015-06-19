'use strict';

angular.module('skillMgmtApp')
	.service('user', function(auth, authenticator, WORLDSKILLS_API_AUTH_CODE)
	{
		this.hasPermission = function(permission)
		{

			return authenticator.hasPermission(auth.user, WORLDSKILLS_API_AUTH_CODE, permission);
		};

	});
