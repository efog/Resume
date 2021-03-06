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