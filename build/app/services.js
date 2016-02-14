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

  var saveTransitions = function saveTransitions(data) {
    return $http({
      method: 'POST',
      url: '/api/transitions',
      data: data
    });
  };

  var getTransitions = function getTransitions() {
    return $http({
      method: 'GET',
      url: '/api/transitions'
    }).then(function (res) {
      return res.data;
    });
  };

  var savePressTimes = function savePressTimes(data) {
    return $http({
      method: 'POST',
      url: '/api/pressTimes',
      data: data
    });
  };

  var getPressTimes = function getPressTimes() {
    return $http({
      method: 'GET',
      url: '/api/pressTimes'
    }).then(function (res) {
      return res.data;
    });
  };

  return {
    getPrompt: getPrompt,
    saveTransitions: saveTransitions,
    getTransitions: getTransitions,
    savePressTimes: savePressTimes,
    getPressTimes: getPressTimes
  };
});