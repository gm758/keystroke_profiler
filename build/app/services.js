'use strict';

angular.module('profiler.services', []).factory('AJAX', function ($http) {
  console.log('ajax');
  var getPrompt = function getPrompt() {
    console.log('getPrompt');
    return $http({
      method: 'GET',
      url: '/api/prompts'
    }).then(function (res) {
      return res.data;
    });
  };

  return {
    getPrompt: getPrompt
  };
});