define(['jquery', 'underscore', 'modules/controller', 'text!config/languages.json', 'shared'],
    function ($, _, controllers, languages) {
        'use strict';

        controllers.controller('Editor', function ($scope) {

            $scope.data = {
                languages: JSON.parse(languages),
                editors: [],
                editor_margin: 10,
                editor_width: 100,
                next_it: 0
            };

            $scope.add_panel = function (obj) {
                var new_count = $scope.data.editors.length + 1;
                $scope.data.editor_width = (100 / new_count);

                $scope.data.next_it++;
                obj.it = $scope.data.next_it;
                obj.ribbon = false;
                $scope.data.editors.push(obj);
            };

            $scope.delete_panel = function (it) {
                var editor = _.findWhere($scope.data.editors, {it: it});
                var message = {
                    action: "close",
                    language: editor.language,
                    name: editor.name,
                    same_window: true
                };

                $scope.data.editors = _.without($scope.data.editors, editor);
                var count = $scope.data.editors.length;
                $scope.data.editor_width = (100 / count);

                $scope.$emit('file', message);
            };

            $scope.toggle_settings_ribbon = function (it) {
                var ribbon = $('#ribbon-' + it);
                var editor = _.findWhere($scope.data.editors, {it: it});
                if(editor.ribbon){
                    ribbon.fadeOut(300);
                } else {
                    ribbon.fadeIn(300);
                }
                editor.ribbon = editor.ribbon ? false : true;
            };

            $scope.set_color = function (id) {
                return getRGB(id);
            };

            $scope.get_language_title = function (id) {
                return $scope.data.languages[id].title;
            };

            $scope.select_language = function(it){
                console.log(it);
            }

            $scope.$onRootScope('file', function (event, message) {
                if(message.action === 'open'){
                    $scope.add_panel(message);
                }
            });

        });
    });
