require.config({

    paths: {
        'angular': '../lib/angular/angular.min',
        'ngRoute': '../lib/angular/angular-route.min',
        'ngResource': '../lib/angular/angular-resource.min',
        'jquery': '../lib/jquery/jquery',
        'underscore': '../lib/underscore/underscore.min',
        'text' : '../lib/require/text',
        'shared' : '../lib/shared/shared',
        'ace' : '../lib/ace/src-min/ace',
        'd3' : '../lib/d3/d3.min'
    },

    shim: {
        'angular': {
            exports: 'angular'
        },
        'ngRoute': {
            deps: ['angular']
        },
        'ngResource': {
            deps: ['angular']
        },
        'underscore': {
            exports: '_'
        }
    }
});


define([ 'jquery', 'underscore', 'angular', 'app', 'router'], function ($, _, angular) {
    'use strict';

    $(document).ready(function(){
        angular.bootstrap(document, ['app']);
    });

});
