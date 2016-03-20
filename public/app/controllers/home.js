(function() {
    'use strict';

    angular
        .module('app')
        .controller('home', home);

    home.$inject = ['$location', 'moment', 'dataService', 'settingsFactory'];

    function home($location, moment, dataService, settingsFactory) {
        var _data = {},
            _earliest,
            _isBusy = false;
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
        Object.defineProperty(vm, 'isBusy', {
            get: function() {
                return _isBusy;
            },
            set: function(value) {
                _isBusy = value;
            }
        });
        Object.defineProperty(vm, 'start', {
            get: function() {
                if (vm.data.workExperience && !_earliest) {
                    _earliest = new Date();
                    vm.data.workExperience.employers.forEach(function(employer) {
                        employer.mandates.forEach(function(mandate) {
                            var d = moment(mandate.startDate);
                            if (d && d < _earliest) {
                                _earliest = d;
                            }
                        });
                    });
                }
                return _earliest;
            }
        });
        activate();
        return vm;
        /**
         * Activate controller
         */
        function activate() {
            _isBusy = true;
            settingsFactory.prime();
            dataService.get(function(resultData) {
                vm.data = resultData;
                _isBusy = false;
            }, function(error) {
                console.log(error);
                _isBusy = false;
            });
        }
    }
})();
