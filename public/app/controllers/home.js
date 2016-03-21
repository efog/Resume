(function() {
    'use strict';

    angular
        .module('app')
        .controller('home', home);

    home.$inject = ['$location', 'moment', 'dataService', 'settingsFactory'];

    function home($location, moment, dataService, settingsFactory) {
        var _data = {},
            _earliest,
            _latest,
            _isBusy = false,
            _employers = [],
            _roles = [],
            _technologies = [],
            _filters = {};
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
        Object.defineProperty(vm, 'employers', {
            get: function() {
                return _employers;
            },
            set: function(value) {
                _employers = value;
            }
        });
        Object.defineProperty(vm, 'filters', {
            get: function() {
                return _filters;
            },
            set: function(value) {
                _filters = value;
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
        Object.defineProperty(vm, 'roles', {
            get: function() {
                return _roles;
            },
            set: function(value) {
                _roles = value;
            }
        });
        Object.defineProperty(vm, 'technologies', {
            get: function() {
                return _technologies;
            },
            set: function(value) {
                _technologies = value;
            }
        });
        Object.defineProperty(vm, 'startYear', {
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
        Object.defineProperty(vm, 'endYear', {
            get: function() {
                if (vm.data.workExperience && !_latest) {
                    _latest = vm.startYear;
                    vm.data.workExperience.employers.forEach(function(employer) {
                        employer.mandates.forEach(function(mandate) {
                            if (!mandate.endDate) {
                                _latest = moment(new Date());
                                return;
                            }
                            var d = moment(mandate.endDate);
                            if (d && d > _latest) {
                                _latest = d;
                            }
                        });
                    });
                }
                return _latest;
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
                setEmployers(vm.data);
                setRoles(vm.data);
                setTechnologies(vm.data);
                setFilters();
                _isBusy = false;
            }, function(error) {
                console.log(error);
                _isBusy = false;
            });
        }
        function setFilters() {
            if (!_filters['employers']) {
                _filters['employers'] = {};
            }
            vm.employers.forEach(function(employer) {
                _filters.employers[employer] = true;
            });

            if (!_filters['roles']) {
                _filters['roles'] = {};
            }
            vm.roles.forEach(function(role) {
                _filters.roles[role] = true;
            });

            if (!_filters['technologies']) {
                _filters['technologies'] = {};
            }
            vm.technologies.forEach(function(tech) {
                _filters.technologies[tech] = true;
            });
        }
        function setEmployers(data) {
            var employers = '';
            vm.employers = data.workExperience.employers.map(function(employer) {
                if (employers.indexOf(employer.name) === -1) {
                    employers += employer.name;
                    return employer;
                }
                return null;
            });
        }
        function setRoles(data) {
            var roles = '';
            var lang = settingsFactory.lang;
            data.workExperience.employers.forEach(function(employer) {
                var tmpr = employer.mandates.map(function(mandate) {
                    var name = '';
                    if (mandate.role[lang]) {
                        name += '"' + mandate.role[lang] + '"';
                    }
                    else {
                        name += '"' + mandate.role + '"';
                    }
                    if (roles.indexOf('"' + name + '"') === -1) {
                        return name;
                    }
                    return null;
                });
                vm.roles = vm.roles.concat(tmpr);
            });
            roles = '';
            vm.roles = vm.roles.map(function(role) {
                if (roles.indexOf(role) === -1) {
                    roles += role;
                    return role.split('"')[1];
                }
                return null;
            });
        }
        function setTechnologies(data) {
            var techs = [];
            var technologies = '';
            var lang = settingsFactory.lang;
            data.workExperience.employers.forEach(function(employer) {
                employer.mandates.forEach(function(mandate) {
                    if (!mandate.technologies) { return; }
                    var tmp = mandate.technologies.map(function(tech) {
                        if (technologies.indexOf(tech) === -1) {
                            technologies += tech;
                            return tech;
                        }
                        return null;
                    });
                    techs = techs.concat(tmp);
                });
            });
            vm.technologies = techs;
        }
    }
})();
