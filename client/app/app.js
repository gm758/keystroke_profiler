angular.module('profiler', [
  'profiler.services'
  ])
  .controller('ProfileController', ($scope, AJAX) => {
    $scope.prompt = AJAX.getPrompt();

  });
