angular.module('profiler.services', [])
  .factory('AJAX', ($http) => {
    const getPrompt = () => {
      return $http({
        method: 'GET',
        url: '/api/prompts'
      }).then(res => res.data);
    };

    return {
      getPrompt,
    };
  });