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
                if(val === "certification.name"){
                    debugger;
                }
                return getForTarget(val());
            };
        }
    }
})();
