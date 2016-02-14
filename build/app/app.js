'use strict';

angular.module('profiler', ['profiler.services']).controller('ProfileController', function ($scope, AJAX, Graph) {
  AJAX.getPrompt().then(function (data) {
    $scope.prompt = data.split(' ');
  });

  $scope.selected = { id: 0 };

  var pressTimes = {};
  var transitionTime = {};

  // going on assumption that keys are released in the orde they are pressed
  // should add more robust solution in the future
  var keyDownQueue = [];
  var keyUpStack = [];
  var down = false;

  var timeDown = undefined;
  var timeUp = undefined;

  var lastKeyUp = undefined;
  var curKeyDown = undefined;

  // TODO: consider/test for edge cases
  $scope.handleDown = function (event) {
    if (!down) {
      down = true;
      timeDown = event.timeStamp;
      curKeyDown = String.fromCharCode(event.which);

      keyDownQueue.push(timeDown);

      if (!keyUpStack.length) {
        return;
      }
      var lastKeyUpTuple = keyUpStack.pop();
      var elapsed = timeDown - lastKeyUpTuple[1];
      if (lastKeyUpTuple[0] in transitionTime) {
        if (curKeyDown in transitionTime[lastKeyUpTuple[0]]) {
          transitionTime[lastKeyUpTuple[0]][curKeyDown].push(elapsed);
        } else {
          // may be unnecessary
          transitionTime[lastKeyUpTuple[0]][curKeyDown] = [elapsed];
        }
      } else {
        transitionTime[lastKeyUpTuple[0]] = {};
        transitionTime[lastKeyUpTuple[0]][curKeyDown] = [elapsed];
      }
    }
  };

  $scope.handleUp = function (event) {
    down = false;
    timeUp = event.timeStamp;
    lastKeyUp = String.fromCharCode(event.which);
    keyUpStack.push([lastKeyUp, timeUp]);

    var elapsed = timeUp - keyDownQueue.shift();;

    pressTimes[lastKeyUp] ? pressTimes[lastKeyUp].push(timeUp - timeDown) : pressTimes[lastKeyUp] = [timeUp - timeDown];
    if (lastKeyUp === ' ') {
      $scope.selected.id++;
    }
  };

  $scope.submitClick = function () {
    console.log(pressTimes);
    AJAX.saveTransitions(transitionTime).then(function (res) {
      console.log(res);
    });

    AJAX.savePressTimes(pressTimes).then(function (res) {
      console.log(res);
    });
  };

  $scope.showTransClick = function () {
    AJAX.getTransitions().then(function (res) {
      console.log(res);
    });
  };

  $scope.showPressClick = function () {
    d3.selectAll('.pressChart').remove();
    AJAX.getPressTimes().then(function (res) {
      console.log(res[res.length - 1]);
      Graph.generateGraph(res[res.length - 1]);
    });
  };
});