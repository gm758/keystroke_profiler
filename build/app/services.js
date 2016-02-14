'use strict';

angular.module('profiler.services', []).factory('AJAX', function ($http) {
  var getPrompt = function getPrompt() {
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