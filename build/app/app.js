'use strict';

angular.module('profiler', ['profiler.services']).controller('ProfileController', function ($scope, AJAX) {
  AJAX.getPrompt().then(function (data) {
    $scope.prompt = data.split(' ');
  });

  $scope.selected = { id: 0 };

  var data = {};
  var key = '';
  var timeDown = undefined;
  var timeUp = undefined;
  var down = false;
  // TODO: consider/test for edge cases
  $scope.handleDown = function (event) {
    if (!down) {
      key = String.fromCharCode(event.which);
      timeDown = event.timeStamp;
      down = true;
    }
  };

  $scope.handleUp = function (event) {
    timeUp = event.timeStamp;
    data[key] ? data[key].push(timeUp - timeDown) : data[key] = [timeUp - timeDown];
    if (key === ' ') {
      $scope.selected.id++;
    }
    down = false;
    console.log(data);
  };
});