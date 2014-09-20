'use strict';
/*jshint unused:vars*/
angular.module('Bullet3.directives',[])
  .directive('slidingBackground', function () {
    return {
      template: '<div class="sliding-background"></div>',
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var speed = 80;
        var pos = 0;
        var child=element.children(1);
        function bgScroll(){
          console.log('scroll');
          pos += 1;
          child.css({backgroundPosition: pos + 'px '+0+'px'});
        }
        setInterval(bgScroll, speed);
      }
    };
  })
  .directive('fadeBar', function($timeout) {
    return {
      restrict: 'E',
      template: '<div class="fade-bar"></div>',
      replace: true,
      link: function($scope, $element, $attr) {
        // Run in the next scope digest
        $timeout(function() {
          // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is
          $scope.$watch('sideMenuController.getOpenRatio()', function(ratio) {
            // Set the transparency of the fade bar
            $element[0].style.opacity = Math.abs(ratio);
          });
        });
      }
    };
  });