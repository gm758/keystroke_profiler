'use strict';

angular.module('profiler', ['profiler.services']).controller('ProfileController', function ($scope, AJAX) {
  $scope.prompt = AJAX.getPrompt();
});