(function (angular) {
  'use strict';

  angular.module('App', [
    'ngScrollGlue'
  ]).

  controller('Main', [
    '$scope', '$timeout',

    function ItemsCtrl($scope, $timeout) {
      $scope.year = new Date().getFullYear();
      $scope.items = ['1', '2', '3'];
      $scope.glued = true;

      var counter = $scope.items.slice(-1)[0];

      $scope.glued = true;

      function addItem() {
        $scope.items.push(++counter);
        $scope.text = $scope.items.join('\n');
        $timeout(addItem, 1000);
      }

      $('.nav-pills').affix({
        offset: {
          top: function () {
            return (this.top = $('.jumbotron').outerHeight(true) + 30);
          }
        }
      });

      $timeout(addItem, 1000);
    }
  ]);

}(angular));
