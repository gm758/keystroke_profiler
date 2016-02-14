angular.module('profiler.services', [])
  .factory('AJAX', ($http) => {
    const getPrompt = () => {
      return $http({
        method: 'GET',
        url: '/api/prompts'
      }).then(res => res.data);
    };

    const saveProfile = (data) => {
      return $http({
        method: 'POST',
        url: '/api/entries',
        data: data,
      })
    }

    const getProfiles = () => {
      return $http({
        method: 'GET',
        url: '/api/entries'
      }).then(res => res.data);
    }

    return {
      getPrompt,
      saveProfile,
      getProfiles,
    };
  });