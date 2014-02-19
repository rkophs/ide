define(['modules/controller'], function (controllers) {
    'use strict';

    controllers.controller('Navigation', function ($scope) {

        $scope.nav_blocks = {
            file_selector: {
                show: false
            }
        };

        $scope.nav_button = {
            radius: 10,
            stroke: 2,
            padding: 5
        };

        $scope.open_nav_block = function(id){
            if(id === "file_selector"){
                $scope.$emit('file_selector', 'open');
            }
        };

        $scope.close_nav_block = function(id){
            if(id === "file_selector"){
                $scope.$emit('file_selector', 'close');
            }
        }
    });
})
