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
  .directive('wsiTextfield', function () {
	  return {
		  restrict: 'E',
		  scope: {
			question: '='
		  },
		  templateUrl: '../../views/forms/textfield.html'
	  }
  })
  .directive('wsiRadio', function () {
	  return {
		  restrict: 'E',
		  scope: {
			question: '='
		  },
		  templateUrl: '../../views/forms/radio.html'
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
			expert: '=',
			position: '='
		  },
		  templateUrl: '../../views/forms/expert_pin.html'
	  }
  });
