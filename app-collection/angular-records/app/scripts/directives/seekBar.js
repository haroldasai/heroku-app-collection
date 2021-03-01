 (function() {
     function seekBar($document) {

         var calculatePercent = function(seekBar, event) {
             var offsetX = event.pageX - seekBar.offset().left;
             var seekBarWidth = seekBar.width();
             var offsetXPercent = offsetX / seekBarWidth;
             offsetXPercent = Math.max(0, offsetXPercent);
             offsetXPercent = Math.min(1, offsetXPercent);
             return offsetXPercent;
         };

         return {
             templateUrl: '/angular-records/templates/directives/seek_bar.html',
             replace: true,
             restrict: 'E',
             scope: {
                 onChange: '&'
             },
             link: function(scope, element, attributes) {
                 scope.value = 0;
                 scope.max = 100;
                 scope.mute = false;

                 var seekBar = $(element);

                 attributes.$observe('value', function(newValue) {
                     scope.value = newValue;
                 });

                 attributes.$observe('max', function(newValue) {
                     scope.max = newValue;
                 });

                 attributes.$observe('mute', function(newValue) {
                     scope.mute = newValue;
                 });

                 var percentString = function () {
                     var value = scope.value;
                     var max = scope.max;
                     var percent = value / max * 100;
                     return percent + "%";
                 };

                 scope.fillStyle = function() {
                     var opacityValue = 1;
                     if(scope.mute === "true") {
                       opacityValue = 0.4;
                     }
                     return {width: percentString(),
                             opacity: opacityValue};
                 };

                 scope.onClickSeekBar = function(event) {
                     var percent = calculatePercent(seekBar, event);
                     scope.value = percent * scope.max;
                     notifyOnChange(scope.value);
                 };

                 scope.thumbStyle = function() {
                     var opacityValue = 1;
                       if(scope.mute === "true") {
                       opacityValue = 0.4;
                     }
                     return {left: percentString(),
                             opacity: opacityValue};

                 };

                 scope.trackThumb = function() {
                     $document.bind('mousemove.thumb', function(event) {
                         var percent = calculatePercent(seekBar, event);
                         scope.$apply(function() {
                             scope.value = percent * scope.max;
                             notifyOnChange(scope.value);
                         });
                     });

                     $document.bind('mouseup.thumb', function() {
                         $document.unbind('mousemove.thumb');
                         $document.unbind('mouseup.thumb');
                     });
                 };

                 var notifyOnChange = function(newValue) {
                     if (typeof scope.onChange === 'function') {
                         scope.onChange({value: newValue});
                     }
                 };

             }
         };
     }

     angular
         .module('blocJams')
         .directive('seekBar', ['$document', seekBar]);
 })();
