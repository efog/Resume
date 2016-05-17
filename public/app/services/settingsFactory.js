(function() {
    'use strict';
    angular
        .module('app')
        .factory('settingsFactory', settingsFactory);
    settingsFactory.$inject = ['$http', '$translate'];
    function settingsFactory($http, $translate) {
        var factory = {};
        Object.defineProperty(factory, 'lang', {
            get: function() { return $translate.preferredLanguage(); },
            set: function(value) { $translate.use(value); }
        });
        factory.prime = function() {
            console.log('priming settings');
        };
        return factory;
    }
})();