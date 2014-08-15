'use strict';

angular.module('skillMgmtApp')
  .directive('wsiTextarea', function () {
	  return {
		  restrict: 'E',
		  scope: {
			question: '='
		  },
		  templateUrl: '../../views/forms/textarea.html'
	  }
  })
  
  .directive('wsiExpertSignoff', function () {
	  return {
		  restrict: 'E',
		  scope: {
			experts: '=',
			ce: '=',
			jp: '='
		  },
		  templateUrl: '../../views/forms/expert_signoff.html'
	  }
  })
  .directive('wsiExpertPin', function () {
	  return {
		  restrict: 'E',
		  scope: {
			expert: '='
		  },
		  templateUrl: '../../views/forms/expert_pin.html'
	  }
  });