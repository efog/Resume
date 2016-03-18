(function() {
    'use strict';
    angular
        .module('app')
        .service('dataService', dataService);
    dataService.$inject = ['$http'];
    function dataService($http) {
        var service = {};
        service.get = function(success, fail) {
            $http.get('/api/data').then(
                function(result) {
                    success(result.data);
                },
                function(error) {
                    fail(error);
                });
        };
        return service;
    }
})();