angular.module('profiler.services', [])
  .factory('AJAX', ($http) => {
    const getPrompt = () => {
      return $http({
        method: 'GET',
        url: '/api/prompts'
      }).then(res => res.data);
    };

    const saveTransitions = (data) => {
      return $http({
        method: 'POST',
        url: '/api/transitions',
        data: data,
      })
    };

    const getTransitions = () => {
      return $http({
        method: 'GET',
        url: '/api/transitions',
      }).then(res => res.data);
    };

    const savePressTimes = (data) => {
      return $http({
        method: 'POST',
        url: '/api/pressTimes',
        data: data,
      })
    };

    const getPressTimes = () => {
      return $http({
        method: 'GET',
        url: '/api/pressTimes',
      }).then(res => res.data);
    };

    return {
      getPrompt,
      saveTransitions,
      getTransitions,
      savePressTimes,
      getPressTimes,
    };
  });