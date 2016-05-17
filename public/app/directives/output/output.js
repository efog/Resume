(function() {
    'use strict';
    angular
        .module('app')
        .directive('output', output);
    output.$inject = ['$timeout', '$window', 'settingsFactory'];
    function output($timeout, $window, settingsFactory) {
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
                substr: '@substr'
            },
            templateUrl: '/app/directives/output/output.html'
        };
        return directive;
        function link(scope, element, attrs) {
            var lang = settingsFactory.lang;
            var sub = scope.substr ? scope.substr : -1;
            var getSub = function(target) {
                if (sub >= 0) {
                    var b = sub;
                    return '...' + target.toString().substr(sub);
                }
                return target;
            };
            var getForObject = function(target) {
                if (target[lang]) {
                    var tVal = target[lang];
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
