(function () {
    'use strict';

    angular
        .module('app')
        .controller('home', home);

    home.$inject = ['$location']; 

    function home($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'home';

        activate();

        function activate() { }
    }
})();
