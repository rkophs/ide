define(['jquery', 'underscore', 'modules/controller', 'text!config/languages.json', 'shared'],
    function ($, _, controllers, languages) {
    'use strict';

    controllers.controller('Editor', function ($scope) {

        var _d = {
            languages: JSON.parse(languages),
            editors: [],
            editor_margin: 10,
            editor_width: 100
        };

        $scope.init = function(){
            $scope.data = {};
            _.defaults($scope.data, _d);
        };

        $scope.init_ace = function(id){
            return "<div>HELLO THERE</div>"
        }

        $scope.add_panel = function(obj){
            var new_count = $scope.data.editors.length + 1;
            $scope.data.editor_width = (100 / new_count);

            obj.it = new_count - 1;
            $scope.data.editors.push(obj);

        };

        $scope.delete_panel = function(it) {
            $scope.data.editors = _.without($scope.data.editors,
                _.findWhere($scope.data.editors, {it: it}));
            var count = $scope.data.editors.length;
            $scope.data.editor_width = (100 / count);
        };

        $scope.set_color = function(id){
            return getRGB(id);
        }

        $scope.get_language_title = function(id){
            return $scope.data.languages[id].title;
        }

        $scope.$onRootScope('file', function(event, message){
            $scope.add_panel(message);
        });
    });
});
