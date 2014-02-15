define(['modules/controller'], function (controllers) {
    'use strict';
    controllers.controller('FileView', function ($scope) {

        $scope.$onRootScope('file', function(event, message){
            console.log("caught in a file view");
            console.log(message);
        });

    });
});
