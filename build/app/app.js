'use strict';

angular.module('profiler', ['profiler.services']).controller('ProfileController', function ($scope, AJAX) {
  AJAX.getPrompt().then(function (data) {
    $scope.prompt = data.split(' ');
  });

  $scope.selected = { id: 0 };

  var pressTimes = {};
  var transitionTime = {};
  var lastKey = '';
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

      if (lastKey === '') {
        return;
      }

      var elapsed = timeDown - timeUp;
      if (lastKey in transitionTime) {
        if (key in transitionTime[lastKey]) {
          transitionTime[lastKey][key].push(elapsed);
        } else {
          // may be unnecessary
          transitionTime[lastKey][key] = [elapsed];
        }
      } else {
        transitionTime[lastKey] = {};
        transitionTime[lastKey][key] = [elapsed];
      }
    }
  };

  $scope.handleUp = function (event) {
    timeUp = event.timeStamp;
    pressTimes[key] ? pressTimes[key].push(timeUp - timeDown) : pressTimes[key] = [timeUp - timeDown];
    if (key === ' ') {
      $scope.selected.id++;
    }
    down = false;
    lastKey = key;
  };

  $scope.submitClick = function () {
    AJAX.saveProfile(transitionTime).then(function (res) {
      console.log(res);
    });
  };

  $scope.showClick = function () {
    AJAX.getProfiles().then(function (res) {
      console.log(res);
    });
  };
});