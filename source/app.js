define(['angular', 'ngRoute', 'ngResource', './controllers/index', './directives/index', './filters/index', './services/index'],
    function (angular) {
        'use strict';

        var app = angular.module('app', [ 'app.controllers', 'app.directives', 'app.filters', 'app.services', 'ngRoute', 'ngResource']);

        return app;

    });