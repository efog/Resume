(function() {
    'use strict';
    angular
        .module('app')
        .factory('settingsFactory', settingsFactory);
    settingsFactory.$inject = ['$http'];
    function settingsFactory($http) {
        var factory = {};
        Object.defineProperty(factory, 'lang', {
            get: function() { return 'en'; }
        });
        factory.prime = function() {
            console.log('priming settings');
        };
        return factory;
    }
})();