angular.module('profiler', [
  'profiler.services'
  ])
  .controller('ProfileController', ($scope, AJAX) => {
    AJAX.getPrompt().then((data) => {
      $scope.prompt = data.split(' ');
    });

    $scope.selected = {id: 0};
    $scope.press = (event) => {
      let key = String.fromCharCode(event.charCode);
      if (key === ' ') {
        $scope.selected.id++;
      }
    }


  });
