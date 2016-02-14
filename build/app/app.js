'use strict';

angular.module('profiler', ['profiler.services']).controller('ProfileController', function ($scope, AJAX) {
  AJAX.getPrompt().then(function (data) {
    $scope.prompt = data.split(' ');
  });

  $scope.selected = { id: 0 };
  $scope.press = function (event) {
    var key = String.fromCharCode(event.charCode);
    if (key === ' ') {
      $scope.selected.id++;
    }
  };
});