(function () {
    'use strict';

    angular
        .module('app')
        .controller('home', home);

    home.$inject = ['$location', '$rootScope', '$translate', 'moment', 'dataService', 'settingsFactory'];

    function home($location, $rootScope, $translate, moment, dataService, settingsFactory) {
        var _data = {},
            _collapsed = {},
            _earliest,
            _latest,
            _isBusy = false,
            _employers = [],
            _roles = [],
            _technologies = [],
            _employerFilters = [],
            _roleFilters = [],
            _techFilters = [];
        /* jshint validthis:true */
        var vm = this;
        vm.collapseMandate = collapseMandate;
        Object.defineProperty(vm, 'data', {
            get: function () {
                return _data;
            },
            set: function (value) {
                _data = value;
            }
        });
        Object.defineProperty(vm, 'defaultTechs', {
            get: function () {
                var defaultTechs = '.NET 4.5 C# WinForms Agile Entity NodeJS Express Swift XCode Framework WCF SQL Server ASP.Net MVC GIT UX Design HTML5 JavaScript CSS AngularJS SignalR REST ';
                defaultTechs += 'JQuery Bootstrap IOS Android Apple AppStore Google PlayStore WPF MVVM Unity TDD Windows Phone WebAPI GDI+ NHibernate SCRUM Azure PaaS IaaS SQL Azure Azure WebJobs';
                return defaultTechs;
            }
        });
        Object.defineProperty(vm, 'employerFilters', {
            get: function () {
                return _employerFilters;
            },
            set: function (value) {
                _employerFilters = value;
            }
        });
        Object.defineProperty(vm, 'employers', {
            get: function () {
                return _employers;
            },
            set: function (value) {
                _employers = value;
            }
        });
        Object.defineProperty(vm, 'filteredEmployers', {
            get: function () {
                if (!vm.data || !vm.data.workExperience) { return []; }
                var mapped = vm.data.workExperience.employers.map(function (emp) {
                    if (vm.employerFilters[emp.name]) {
                        return emp;
                    }
                });
                var retVal = [];
                mapped.forEach(function (r) {
                    if (r) {
                        retVal.push(r);
                    }
                });
                return retVal;
            }
        });
        Object.defineProperty(vm, 'filteredRoles', {
            get: function () {
                if (!vm.data || !vm.filteredEmployers) { return []; }
                var lang = settingsFactory.lang;
                var roles = [];
                for (var i = 0; i < vm.filteredEmployers.length; i++) {
                    var emp = vm.filteredEmployers[i];
                    if (!emp) { continue; }
                    roles = roles.concat(emp.mandates.map(function (mandate) {
                        var role = mandate.role[$translate.use()] ? mandate.role[$translate.use()] : mandate.role;
                        return role;
                    }));
                }
                var retVal = [];
                roles.forEach(function (r) {
                    if (retVal.indexOf(r) === -1) {
                        retVal.push(r);
                    }
                });
                return retVal;
            }
        });
        Object.defineProperty(vm, 'isBusy', {
            get: function () {
                return _isBusy;
            },
            set: function (value) {
                _isBusy = value;
            }
        });
        Object.defineProperty(vm, 'projects', {
            get: function () {
                if (!vm.data || !vm.data.workExperience) { return []; }
                var projects = [];
                for (var i = 0; i < vm.data.workExperience.employers.length; i++) {
                    for (var j = 0; j < vm.data.workExperience.employers[i].mandates.length; j++) {
                        var mandate = vm.data.workExperience.employers[i].mandates[j];
                        mandate.products.forEach(function (p) { projects.push(p); });
                    }
                }
                return projects;
            }
        });
        Object.defineProperty(vm, 'roleFilters', {
            get: function () {
                return _roleFilters;
            },
            set: function (value) {
                _roleFilters = value;
            }
        });
        Object.defineProperty(vm, 'roles', {
            get: function () {
                return _roles;
            },
            set: function (value) {
                _roles = value;
            }
        });
        Object.defineProperty(vm, 'techFilters', {
            get: function () {
                return _techFilters;
            },
            set: function (value) {
                _techFilters = value;
            }
        });
        Object.defineProperty(vm, 'technologies', {
            get: function () {
                return _technologies;
            },
            set: function (value) {
                _technologies = value;
            }
        });
        Object.defineProperty(vm, 'startYear', {
            get: function () {
                if (vm.data.workExperience && !_earliest) {
                    _earliest = new Date();
                    vm.filteredEmployers.forEach(function (employer) {
                        employer.mandates.forEach(function (mandate) {
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
            get: function () {
                if (vm.data.workExperience && !_latest) {
                    _latest = vm.startYear;
                    vm.filteredEmployers.forEach(function (employer) {
                        employer.mandates.forEach(function (mandate) {
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
        Object.defineProperty(vm, 'lang', {
            get: function () { return $translate.use(); }
        });
        activate();
        vm.setLang = setLang;
        return vm;
        /**
         * Activate controller 
         */
        function activate() {
            vm.isFilteredOut = isFilteredOut;
            vm.employerMandates = employerMandates;
            _isBusy = true;
            settingsFactory.prime();
            dataService.get(function (resultData) {
                vm.data = resultData;
                setEmployers(vm.data);
                setRoles(vm.data);
                setTechnologies(vm.data);
                setFilters();
                _isBusy = false;
            }, function (error) {
                console.log(error);
                _isBusy = false;
            });
        }
        /**
         * Set language of UI
         */
        function setLang(lang) {
            $translate.use(lang);
            setTimeout($rootScope.$apply(), 3);
        }
        /**
         * Collapse mandate
         */
        function collapseMandate(event, mandate) {
            event.preventDefault();
            mandate['collapsed'] = !mandate.collapsed;
        }
        function employerMandates(mandates) {
            var retVal = [];
            mandates.forEach(function (m) {
                if (!vm.isFilteredOut(m)) {
                    retVal.push(m);
                }
            });
            return retVal;
        }
        function isFilteredOut(mandate) {
            var lang = settingsFactory.lang;
            var role = mandate.role[$translate.use()] ? mandate.role[$translate.use()] : mandate.role;

            var techFiltered = false;
            for (var i = 0; i < mandate.technologies.length; i++) {
                techFiltered = techFiltered || vm.techFilters[mandate.technologies[i]];
                if (techFiltered) { break; }
            }

            var filtered = false;
            filtered = filtered || !vm.roleFilters[role] || !techFiltered;
            return filtered;
        }
        function setFilters() {
            vm.employers.forEach(function (employer) {
                if (!employer.name) { return; }
                var name = employer.name;
                if (name && name !== '') {
                    _employerFilters[name] = true;
                }
            });
            vm.roles.forEach(function (role) {
                if (!role) { return; }
                var name = role;
                if (name && name !== '') {
                    _roleFilters[name] = true;
                }
            });
            vm.technologies.forEach(function (tech) {
                if (!tech) { return; }
                var name = tech;
                if (name && name !== '') {
                    _techFilters[name] = vm.defaultTechs.indexOf(name) !== -1;
                }
            });
        }
        function setEmployers(data) {
            var employers = '';
            vm.employers = data.workExperience.employers.map(function (employer) {
                if (employer && employers.indexOf(employer.name) === -1) {
                    employers += employer.name;
                    return employer;
                }
                return null;
            });
        }
        function setRoles(data) {
            var rolesArr = [];
            var roles = '';
            var lang = settingsFactory.lang;
            data.workExperience.employers.forEach(function (employer) {
                var tmpr = employer.mandates.map(function (mandate) {
                    var name = '';
                    mandate.collapsed = true;
                    if (mandate.role[$translate.use()]) {
                        name += '"' + mandate.role[$translate.use()] + '"';
                    }
                    else {
                        name += '"' + mandate.role + '"';
                    }
                    if (roles.indexOf('"' + name + '"') === -1) {
                        return name;
                    }
                });
                rolesArr = rolesArr.concat(tmpr);
            });
            roles = '';
            rolesArr = rolesArr.map(function (role) {
                if (role && roles.indexOf(role) === -1) {
                    roles += role;
                    return role.split('"')[1];
                }
            });
            vm.roles.length = 0;
            rolesArr.forEach(function (r) {
                if (r) {
                    vm.roles.push(r);
                }
            });
        }
        function setTechnologies(data) {
            var techs = [];
            var technologies = '';
            var lang = settingsFactory.lang;
            data.workExperience.employers.forEach(function (employer) {
                employer.mandates.forEach(function (mandate) {
                    if (!mandate.technologies) { return; }
                    var tmp = mandate.technologies.map(function (tech) {
                        if (tech && technologies.indexOf(tech) === -1) {
                            technologies += tech;
                            return tech;
                        }
                    });
                    techs = techs.concat(tmp);
                });
            });
            vm.technologies.length = 0;
            techs.forEach(function (t) {
                if (t) {
                    vm.technologies.push(t);
                }
            });
        }
    }
})();
