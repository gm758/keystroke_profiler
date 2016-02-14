angular.module('profiler', [
  'profiler.services'
  ])
  .controller('ProfileController', ($scope, AJAX) => {
    AJAX.getPrompt().then((data) => {
      $scope.prompt = data.split(' ');
    });

    $scope.selected = {id: 0};

    let pressTimes = {};
    let transition_time = {};
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

        let transitionTime = timeDown - timeUp;
        if (lastKey in transition_time) {
          if (key in transition_time[lastKey]) {
            transition_time[lastKey][key].push(transitionTime);
          } else { // may be unnecessary
            transition_time[lastKey][key] = [transitionTime];
        } else {
          transition_time[lastKey] = {key: [transitionTime]};
        }


        down = true;
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

  });
