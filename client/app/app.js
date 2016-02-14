angular.module('profiler', [
  'profiler.services'
  ])
  .controller('ProfileController', ($scope, AJAX) => {
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
      AJAX.saveProfile(transitionTime).then((res) => {
        console.log(res);
      });
    }

    $scope.showClick = () => {
      AJAX.getProfiles().then((res) => {
        console.log(res);
      });
    }
  });
