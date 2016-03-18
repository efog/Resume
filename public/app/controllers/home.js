(function() {
    'use strict';

    angular
        .module('app')
        .controller('home', home);

    home.$inject = ['$location', 'dataService', 'settingsFactory'];

    function home($location, dataService, settingsFactory) {
        var _data = {};
        /* jshint validthis:true */
        var vm = this;
        Object.defineProperty(vm, 'data', {
            get: function() {
                return _data;
            },
            set: function(value) {
                _data = value;
            }
        });
        activate();
        return vm;
        /**
         * Activate controller
         */
        function activate() {
            settingsFactory.prime();
            dataService.get(function(resultData) {
                vm.data = resultData;
            }, function(error) {
                console.log(error);
            });
        }
    }
})();
