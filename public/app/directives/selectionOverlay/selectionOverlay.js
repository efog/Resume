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
                items: '=items',
                filters: '=filters'
            },
            templateUrl: '/app/directives/selectionOverlay/selectionOverlay.html'
        };
        return directive;
        function link(scope, element, attrs) {
        }
    }
})();