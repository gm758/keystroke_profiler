angular.module('profiler', [
  'profiler.services'
  ])
  .controller('ProfileController', ($scope, AJAX, Graph) => {
    AJAX.getPrompt().then((data) => {
      $scope.prompt = data.split(' ');
    });

    $scope.selected = {id: 0};

    let pressTimes = {};
    let transitionTime = {};

    // going on assumption that keys are released in the orde they are pressed
    // should add more robust solution in the future
    let keyDownQueue = [];
    let keyUpStack = [];
    let down = false;

    let timeDown;
    let timeUp;

    let lastKeyUp;
    let curKeyDown;

    // TODO: consider/test for edge cases
    // Review this section of the code, ensuring all logic is sound
    $scope.handleDown = (event) => {
      if (!down) {
        down = true;
        timeDown = event.timeStamp;
        curKeyDown = keyboardMap[event.which];

        keyDownQueue.push(timeDown);

        if (!keyUpStack.length) {
          return;
        }
        const lastKeyUpTuple = keyUpStack.pop();
        const elapsed = timeDown - lastKeyUpTuple[1];

        if (lastKeyUpTuple[0] in transitionTime) {
          if (curKeyDown in transitionTime[lastKeyUpTuple[0]]) {
            transitionTime[lastKeyUpTuple[0]][curKeyDown].push(elapsed);
          } else { // may be unnecessary
            transitionTime[lastKeyUpTuple[0]][curKeyDown] = [elapsed];
          }
        } else {
          transitionTime[lastKeyUpTuple[0]] = {};
          transitionTime[lastKeyUpTuple[0]][curKeyDown] = [elapsed];
        }
      }
    };

    $scope.handleUp = (event) => {
      down = false;
      timeUp = event.timeStamp
      lastKeyUp = keyboardMap[event.which];
      keyUpStack.push([lastKeyUp, timeUp]);

      let elapsed = timeUp - keyDownQueue.shift();;

      pressTimes[lastKeyUp] ? pressTimes[lastKeyUp].push(timeUp - timeDown) : pressTimes[lastKeyUp] = [timeUp - timeDown];
      if (lastKeyUp === ' ') {
        $scope.selected.id++;
      }
    };


    $scope.submitClick = () => {
      AJAX.saveTransitions(transitionTime).then((res) => {
        console.log(res);
      });

      AJAX.savePressTimes(pressTimes).then((res) => {
        console.log(res);
      })
    };

    $scope.showTransClick = () => {
      AJAX.getTransitions().then((res) => {
        console.log(res);
      });
    };

    $scope.showPressClick = () => {
      d3.selectAll('.pressChart').remove();
      AJAX.getPressTimes().then((res) => {
        Graph.generatePressGraph(res[res.length - 1]); 
      });
    }

  });
