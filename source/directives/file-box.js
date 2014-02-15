define(['modules/directive'], function (directives) {
    'use strict';
    directives.directive('fileBox', function () {
        return {
            restrict: 'E',
            templateUrl: 'source/templates/file-box.html'
        };
    });
});
