'use strict';

angular.module('skillMgmtApp')
	.service('authenticator', function(WORLDSKILLS_API_AUTH_CODE)
	{
		this.hasPermission = function(user, webServiceCode, permission)
        {
			if (!!user)
			{
				for (var i=0; i<user.roles.length; i++)
				{
					if (user.roles[i].name == permission
							&& user.roles[i].role_application.application_code == webServiceCode)
					{
						return true;
					}
				}
			}
			return false;
       	};

		this.authenticate = function(user)
		{
			return this.hasPermission(user, WORLDSKILLS_API_AUTH_CODE, 'Admin') || this.hasPermission(user, WORLDSKILLS_API_AUTH_CODE, 'CreateResource');
		}
	});
