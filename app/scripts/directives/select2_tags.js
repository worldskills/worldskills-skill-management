'use strict';

angular.module('skillMgmtApp')
  .directive('wsiTags', function () {
	  
	  return {
		  link: function(scope, element, attrs) {
			  scope.$watch(attrs.wsiTags, function(value) {
				  element.select2(scope.tagOptions);
			  });
		  }
	  }
  });