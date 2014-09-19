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
  });