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
            restrict: 'E',
            templateUrl: '/app/directives/filterSelect/filterSelect.html',
            transclude: true,
            scope: {
                value: '=dataValue',
                filtered: '=dataFiltered'
            }
        };
        return directive;
        function link(scope, element, attrs) {
            console.log(scope);
        }
    }
    /* @ngInject */
    function ControllerController() {

    }
})();