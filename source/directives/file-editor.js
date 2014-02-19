define(['jquery', 'modules/directive', 'ace'], function ($, directives) {
    'use strict';
    directives.directive('fileEditor', function () {
        return {
            restrict: 'E',
            template: '<div class="editor"></div>',
            link: function(scope, element, attrs){

                var el = element.children()[0];
                $(el).attr("id", "editor" + attrs.it);

                var editor = ace.edit( "editor" + attrs.it);
                editor.setTheme("ace/theme/twilight");
                editor.getSession().setMode("ace/mode/json");
                _.findWhere(scope.$parent.data.editors, {it: parseInt(attrs.it)}).ace = editor;
            }
        };
    });
});
