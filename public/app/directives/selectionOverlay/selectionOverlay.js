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