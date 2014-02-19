define(['modules/directive'], function (directives) {
    'use strict';
    directives.directive('navBar', function () {
        return {
            restrict: 'E',
            templateUrl: 'source/templates/nav-bar.html'
        };
    });
});
