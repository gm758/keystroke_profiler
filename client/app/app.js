angular.module('profiler', [
  'profiler.services'
  ])
  .controller('ProfileController', ($scope, AJAX) => {
    AJAX.getPrompt().then((data) => {
      $scope.prompt = data.split(' ');
    });

    $scope.selected = {id: 1};
    // $scope.setSelected = function(id) {
    //   $scope.selected.id = id;
    // }
  });
