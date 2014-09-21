'use strict';
/*jshint unused:vars */
angular.module('Bullet3.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};
  $scope.hideBackButton=true;
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('TopicCtrl', function($scope, $stateParams,CommentService) {
  $scope.topicId=$stateParams.topicId;
  $scope.comments=CommentService.syncAll($scope.topicId);
  console.log($scope.comments,$scope.topicId);
  $scope.saveComment=function(comment){
    CommentService.addItem($scope.comments,$scope.topicId,comment);
  };
})
.controller('BrowseCtrl',function($scope,$state,EventsService){
  $scope.events=EventsService.syncAll();
  $scope.enter=function(id){
    $state.go('app.feed',{
      eventId:id
    });
  };
})
.controller('FeedCtrl',function($scope,$state,$stateParams,$ionicModal,TopicService,$ionicListDelegate){
  $scope.eventId=$stateParams.eventId;
  $scope.topics=TopicService.syncAll($scope.eventId);
  console.log($scope.topics);
  /*Create Topic Modal*/
  $scope.saveTopic=function(topic){
    TopicService.addItem($scope.topics,$scope.eventId,topic);
  };
  $scope.vote=function(id,value){
    $ionicListDelegate.closeOptionButtons();
  };
})
.controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate) {
  // Called to navigate to the main app
  $scope.startApp = function() {
    $state.go('app.browse');
  };
  $scope.next = function() {
    $ionicSlideBoxDelegate.next();
  };
  $scope.previous = function() {
    $ionicSlideBoxDelegate.previous();
  };
  // Called each time the slide changes
  $scope.slideChanged = function(index) {
    $scope.slideIndex = index;
  };
});
