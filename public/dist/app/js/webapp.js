/* global angular */
(function() {
    'use strict';
    var app = angular.module('app', [
        // Angular modules
        'ngAnimate',
        'ngRoute',
        'ngMessages',
        'ngSanitize',
        'ngTouch',
        // Custom modules
        // 3rd Party Modules
        'angularMoment',
        'pascalprecht.translate'
    ]);
    app.constant('routes', getRoutes());
    function getRoutes() {
        return [
            {
                url: '/',
                config: {
                    title: 'home',
                    templateUrl: '/views/home.html',
                    settings: {}
                }
            }
        ];
    }
    app.config(function($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/locale-',
            suffix: '.json'
        });
        $translateProvider.useSanitizeValueStrategy('escapeParameters');
        $translateProvider
            .registerAvailableLanguageKeys(['en', 'fr'], {
                'en_*': 'en',
                'fr_*': 'fr'
            })
            .determinePreferredLanguage();
        $translateProvider.fallbackLanguage(['en', 'fr']);
    });

    app.config(['$httpProvider', '$provide', '$routeProvider', appConfigurator]);
    function appConfigurator($httpProvider, $provide, $routeProvider) {
        $provide.factory('$routeProvider', function() {
            return $routeProvider;
        });
        $provide.decorator('$exceptionHandler', function($delegate, $injector) {
            return function(exception, cause) {
                $delegate(exception, cause);
            };
        });
    }
    app.run(['$http', '$location', '$rootScope', '$injector', '$route', '$routeProvider', 'routes', run]);
    function run($http, $location, $rootScope, $injector, $route, $routeProvider, routes) {
        routes.forEach(function(r) {
            setRoute(r.url, r.config);
        });
        $routeProvider.otherwise({ redirectTo: '/' });
        $route.reload();

        function setRoute(url, config) {
            config.resolve = angular.extend(config.resolve || {}, {
            });
            $routeProvider.when(url, config);
            if (config.editUrl) {
                $routeProvider.when(config.editUrl, config);
            }
        }
        $rootScope.$on('$routeChangeStart', function(event, next, current) {
        });
    }
})();
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
(function() {
    'use strict';

    angular
        .module('app')
        .directive('filterSelect', Directive);

    Directive.$inject = ['$http'];
    function Directive($http) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            templateUrl: '/app/directives/filterSelect/filterSelect.html',
            transclude: true,
            scope: {
                key: '=key',
                selected: '=selected'
            }
        };
        return directive;
        function link(scope, element, attrs) {
            scope.toggle = function() {
                scope.selected = !scope.selected;
            };
        }
    }
    /* @ngInject */
    function ControllerController() {

    }
})();
(function() {
    'use strict';
    angular
        .module('app')
        .directive('output', output);
    output.$inject = ['$timeout', '$translate', '$window', 'settingsFactory'];
    function output($timeout, $translate, $window, settingsFactory) {
        // Usage:
        //     <output></output>
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'AE',
            transclude: false,
            scope: {
                output: '&',
                substr: '@substr',
                lang: '='
            },
            templateUrl: '/app/directives/output/output.html'
        };
        return directive;
        function link(scope, element, attrs) {
            var lang = scope.lang;
            var sub = scope.substr ? scope.substr : -1;
            var getSub = function(target) {
                if (sub >= 0) {
                    var b = sub;
                    return '...' + target.toString().substr(sub);
                }
                return target;
            };
            var getForObject = function(target) {
                if (target[scope.lang]) {
                    var tVal = target[scope.lang];
                    if (Array.isArray(tVal)) {
                        var val = '';
                        tVal.forEach(function(item) {
                            val += '<p>' + getForObject(item) + '</p>';
                        });
                        return val;
                    }
                    return getSub(tVal);
                }
                else {
                    return getSub(target);
                }
            };
            var getForTarget = function(target) {
                if (!target) {
                    return '';
                }
                if ((typeof target) === 'string') {
                    return getSub(target);
                }
                else if ((typeof target) === 'object') {
                    return getForObject(target);
                }
            };
            scope.getEval = function(val) {
                return getForTarget(val());
            };
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('app')
        .directive('selectionOverlay', selectionOverlay);

    selectionOverlay.$inject = ['$http'];
    function selectionOverlay($http) {
        // Usage:
        //
        // Creates:
        //
        var directive = {
            link: link,
            restrict: 'E',
            scope: {
                id: '@id',
                items: '=items',
                filters: '=filters',
                defaults: '=defaults',
                parentId: '@parentId'
            },
            templateUrl: '/app/directives/selectionOverlay/selectionOverlay.html'
        };
        return directive;
        function link(scope, element, attrs) {
            if (!scope.expanded) { scope.expanded = false; }
            scope.toggle = function(event) {
                event.preventDefault();
                var top = $('#' + scope.parentId).offset().top;
                $('#' + scope.id + '>.selection-modal').offset().top = top;
                scope.expanded = !scope.expanded;
            };
            scope.selectAll = function(event) {
                event.preventDefault();
                scope.items.forEach(function(i) {
                    scope.filters[i] = true;
                });
            };
            scope.selectNone = function(event) {
                event.preventDefault();
                scope.items.forEach(function(i) {
                    scope.filters[i] = false;
                });
            };
            Object.defineProperty(scope, 'selected', {
                get: function() {
                    var retVal = [];
                    scope.items.forEach(function(i) {
                        if (scope.filters[i] || scope.defaults.indexOf(i) > -1) {
                            retVal.push(i);
                        }
                    });
                    return retVal;
                }
            });
        }
    }
})();