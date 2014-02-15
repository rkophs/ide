define(['./app'], function (app) {
    'use strict';
    return app.config(['$routeProvider', function ($routeProvider) {

        $routeProvider.when('/editor', {
            templateUrl: 'source/partials/editor.html',
            controller: 'Editor'
        });

        $routeProvider.otherwise({
            redirectTo: '/editor'
        });
    }]);
});
