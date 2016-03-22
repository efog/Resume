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