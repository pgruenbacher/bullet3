'use strict';
/*jshint unused: vars*/
angular.module('Bullet3.directives',[])
  .directive('slidingBackground', function ($interval) {
    return {
      scope:{
        currentStateIs:'@'
      },
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
        // start the UI update process; save the timeoutId for canceling
        var timeoutId = $interval(function() {
          bgScroll(); // update DOM
        }, speed);
        element.on('$destroy', function() {
          console.log('destroy dom');
          $interval.cancel(timeoutId);
        });
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
  })
  .directive('dynamicBanner',function(){
    return{
      templateUrl:'templates/dynamicBanner.html',
      scope:{
        search:'=searchBar',
        searchOn:'@',
        searchToggle:'&'
      },
      restrict:'E',
      link:function(scope,element,attrs){
        scope.clear=function(){
          scope.search='';
          scope.searchToggle(false);
        };
      }
    };
  })
  .directive('commentFormButton',function($ionicModal,TopicService,CommentService){
    return{
      restrict:'E',
      template:'<button ng-click="createTopic()" class="button icon ion-paper-airplane">{{button}}</button>',
      scope:{
        save:'&',
        button: '@'
      },
      link:function(scope,element,attrs){
        $ionicModal.fromTemplateUrl('templates/topicForm.html', {
          scope: scope,
          animation: 'slide-in-up',
          focusFirstInput: true,
          backdropClickToClose: true
        }).then(function(modal) {
          scope.topicModal = modal;
        });
        scope.openTopicModal = function() {
          scope.topicModal.show();
        };
        scope.closeTopicModal = function() {
          scope.topicModal.hide();
        };
        //Cleanup the modal when we're done with it!
        scope.$on('$destroy', function() {
          scope.topicModal.remove();
        });

        scope.createTopic=function(){
          console.log('open');
          scope.openTopicModal();
        };
        scope.submitTopic=function(topic){
          var func=scope.save();
          func(topic);
          scope.closeTopicModal();
        };
      }
    };
  });