'use strict';

describe('Directive: mediumEditor', function () {

	var scope, inlineElement, richElement, defaultElement;
	beforeEach(module('webClientApp'));

	beforeEach(inject(function ($compile, $rootScope) {
		scope = $rootScope;

		defaultElement = angular.element('<h1 medium-editor></h1>');

		inlineElement = angular.element(
				'<h1 medium-editor ' +
							'mode="inline" ' +
							'placeholder="My Placeholder" ' +
							'ng-model="inlineVar"' +
					'>' +
				'</h1>');

		richElement = angular.element(
				'<article medium-editor ' +
										'mode="rich" ' +
										'placeholder="My 2nd Placeholder" ' +
										'maxLength="10" ' +
										'ng-model="myvar" ' +
									'>Hello World' +
				'</article>');

		$compile(defaultElement)(scope);
		$compile(inlineElement)(scope);
		$compile(richElement)(scope);
	}));

	it('should add Medium classes', function () {
		expect(inlineElement.hasClass('Medium')).toBe(true);
		expect(inlineElement.hasClass('Medium-inline')).toBe(true);
		expect(richElement.hasClass('Medium-rich')).toBe(true);
		expect(defaultElement.hasClass('Medium-rich')).toBe(true);
	});

	it('should add contenteditable attributes', function () {
		expect(inlineElement.attr('contenteditable')).toBe('true');
		expect(richElement.attr('contenteditable')).toBe('true');
	});

	it('should add a placeholder in an empty editor', function () {
		var placeholderElement = inlineElement.children();
		expect(placeholderElement.hasClass('Medium-placeholder')).toBe(true);
		expect(placeholderElement.attr('contenteditable')).toBe('false');

		placeholderElement = richElement.children();
		expect(richElement.html()).toBe('Hello World');
		expect(defaultElement.text().trim()).toBe('');
	});

	it('should bind the ng-model to the content', function () {
		expect(scope.myvar).toBe('Hello World');

		scope.$apply(function () {
			scope.myvar = 'What';
		});
		expect(richElement.text()).toBe('What');

		expect(scope.inlineVar).toBe('');
		scope.$apply(function () {
			scope.inlineVar = 'So What';
		});
		expect(inlineElement.text()).toBe('So What');

		// The other way binding.
		inlineElement.html('Hello World');
		inlineElement.triggerHandler('change');
		expect(scope.inlineVar).toBe('Hello World');
	});

});