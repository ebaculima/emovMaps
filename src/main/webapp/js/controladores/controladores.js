//'use strict';

/* Controllers */

var emovControllers = angular.module('emovControllers', ['graficoPie', 'snapscroll', 'ui.bootstrap.pagination']);

emovControllers.controller('ExploreController', ['$scope', '$window',
    function ($scope, $window) {
        console.log($scope.text);
    }]);





