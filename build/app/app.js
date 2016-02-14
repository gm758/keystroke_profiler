'use strict';

angular.module('profiler', ['profiler.services']).controller('ProfileController', function ($scope, AJAX) {
  AJAX.getPrompt().then(function (data) {
    $scope.prompt = data.split(' ');
    $scope.word = 0;
  });
});