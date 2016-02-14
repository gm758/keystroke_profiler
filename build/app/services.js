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

  var saveProfile = function saveProfile(data) {
    return $http({
      method: 'POST',
      url: '/api/entries',
      data: data
    });
  };

  var getProfiles = function getProfiles() {
    return $http({
      method: 'GET',
      url: '/api/entries'
    }).then(function (res) {
      return res.data;
    });
  };

  return {
    getPrompt: getPrompt,
    saveProfile: saveProfile,
    getProfiles: getProfiles
  };
});