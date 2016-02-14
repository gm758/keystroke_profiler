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
    let lastKey = '';
    let key = '';
    let timeDown;
    let timeUp;
    let down = false;

    // TODO: consider/test for edge cases
    $scope.handleDown = (event) => {
      if (!down) {
        key = String.fromCharCode(event.which);
        timeDown = event.timeStamp;
        down = true;

        if (lastKey === '') {
          return;
        }

        let elapsed = timeDown - timeUp;
        if (lastKey in transitionTime) {
          if (key in transitionTime[lastKey]) {
            transitionTime[lastKey][key].push(elapsed);
          } else { // may be unnecessary
            transitionTime[lastKey][key] = [elapsed];
          }
        } else {
          transitionTime[lastKey] = {};
          transitionTime[lastKey][key] = [elapsed];
        }
      }
    };

    $scope.handleUp = (event) => {
      timeUp = event.timeStamp
      pressTimes[key] ? pressTimes[key].push(timeUp - timeDown) : pressTimes[key] = [timeUp - timeDown];
      if (key === ' ') {
        $scope.selected.id++;
      }
      down = false;
      lastKey = key;
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
        console.log('trans');
        console.log(res);
      });
    };

    $scope.showPressClick = () => {
      d3.selectAll('.pressChart').remove();

      AJAX.getPressTimes().then((res) => {
        Graph.generateGraph(res[res.length - 1]); 
      });
    }

  });
