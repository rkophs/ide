define(['modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('FilePicker', function ($scope) {

        $scope.open_file = function(){
            $scope.$emit('file', {
                language: "json",
                name: 'name',
                same_window: true
            });
        };

    });
});
