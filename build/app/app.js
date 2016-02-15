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
  // Review this section of the code, ensuring all logic is sound
  $scope.handleDown = function (event) {
    if (!down) {
      down = true;
      timeDown = event.timeStamp;
      curKeyDown = keyboardMap[event.which];

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
    lastKeyUp = keyboardMap[event.which];
    keyUpStack.push([lastKeyUp, timeUp]);

    var elapsed = timeUp - keyDownQueue.shift();;

    pressTimes[lastKeyUp] ? pressTimes[lastKeyUp].push(elapsed) : pressTimes[lastKeyUp] = [elapsed];
    console.log(lastKeyUp);
    if (lastKeyUp === 'space') {
      console.log('space registered');
      $scope.selected.id++;
    }
    //todo: handle backspaces
  };

  $scope.submitClick = function () {
    AJAX.saveTransitions(transitionTime).then(function (res) {
      console.log(res);
    });

    AJAX.savePressTimes(pressTimes).then(function (res) {
      console.log(res);
    });
  };

  $scope.showTransClick = function () {
    AJAX.getTransitions().then(function (res) {
      Graph.generateTransitionGraph(res[res.length - 1]);
    });
  };

  $scope.showPressClick = function () {
    d3.selectAll('.pressChart').remove();
    AJAX.getPressTimes().then(function (res) {
      Graph.generatePressGraph(res[res.length - 1]);
    });
  };
});