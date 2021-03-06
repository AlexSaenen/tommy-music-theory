(function () {
	angular.module('MyApp.Lessons')

	.controller('StepsController', function() {
		var vm = this;

		vm.questions = [{question:"What is one half step up from F#?",
							correctAnswers: ['G', 'G ', ' G', ' G '],
							feedback: 'Your answer should be one letter long',
							type: 'input'},
							{question:"Is it possible to have two notes with the same name that correlate with different frequencies?",
							possibleAnswers: ["Yes", 'No'],
							correctAnswer: "Yes",
							feedback: '',
							type: 'radio'}];
	});
})();