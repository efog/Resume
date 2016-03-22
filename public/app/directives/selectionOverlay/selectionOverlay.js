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
            if (!scope.expanded) { scope.expanded = false; }
            scope.toggle = function(event) {
                event.preventDefault();
                scope.expanded = !scope.expanded;
            };
            Object.defineProperty(scope, 'selected', {
                get: function() {
                    var retVal = [];
                    scope.items.forEach(function(i) {
                        if (scope.filters[i]) {
                            retVal.push(i);
                        }
                    });
                    return retVal;
                }
            });
        }
    }
})();