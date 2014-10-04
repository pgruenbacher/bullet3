'use strict';
/*jshint unused:vars */
angular.module('Bullet3.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout,$state) {
  // Form data for the login modal
  //$scope.loginData = {};
  $scope.hideBackButton=true;
  $scope.searchOn=false;
  // Create the login modal that we will use later
  // $ionicModal.fromTemplateUrl('templates/login.html', {
  //   scope: $scope,
  //   focusFirstInput:true
  // }).then(function(modal) {
  //   $scope.loginModal = modal;
  // });
  // $scope.showLogin= function(){
  //   $scope.loginModal.show();
  // };
  // // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.loginModal.hide();
  // };
  $scope.searchToggle=function(bool){
    console.log('toggle');
    $scope.searchOn=bool;
  };
  $scope.checkState=function(){
    return $state.is('app.feed')||$state.is('app.topic');
  };
})
.controller('TopicCtrl', function(
  $scope, $stateParams,
  TopicService,CommentService,$ionicListDelegate,ENV, $ionicLoading) {
  $scope.itemHeight={height:ENV.iHEIGHT};
  $scope.topicId=$stateParams.topicId;
  $scope.topic=TopicService.get($scope.topicId);
  $scope.comments=CommentService.syncAll($scope.topicId);
  $ionicLoading.show({
    template:'<i class="icon button-icon ion-loading-d"></i>'
  });
  $scope.comments.$loaded().then(function(){
    $ionicLoading.hide();
  });
  $scope.orderBar='timestamp';
  $scope.search='';
  $scope.saveComment=function(comment){
    CommentService.addItem($scope.comments,$scope.topicId,comment);
  };
  $scope.vote=function(id,value){
    CommentService.vote(id,value);
    $ionicListDelegate.closeOptionButtons();
  };
  $scope.orderF = function(item) {
    if(typeof item[$scope.orderBar]  !== 'undefined'){
      return item[$scope.orderBar];
    }else{
      return 0;
    }
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
.controller('FeedCtrl',function($scope,$state,$stateParams,$ionicModal,$ionicScrollDelegate,
  TopicService,$ionicListDelegate,ENV,$ionicLoading){
  $scope.itemHeight={height:ENV.iHEIGHT};
  $scope.search='';
  $scope.eventId=$stateParams.eventId;
  $scope.topics=TopicService.syncAll($scope.eventId);
  $ionicLoading.show({
    template: '<i class="icon button-icon ion-loading-d"></i>'
  });
  $scope.topics.$loaded().then(function(){
    $ionicLoading.hide();
  });
  $scope.orderBar='timestamp';
  $scope.$watch('topics.length',function(){
    if($scope.orderBar==='timestamp'||true){
      console.log($ionicScrollDelegate.getScrollPosition());
      if($ionicScrollDelegate.getScrollPosition().top > $scope.itemHeight.height){
        console.log($scope.itemHeight.height);
        $ionicScrollDelegate.scrollBy(0,$scope.itemHeight.height,false);
      }
      console.log('scroll to bottom');
    }
  });
  $scope.orderF = function(item) {
    if(typeof item[$scope.orderBar]  !== 'undefined'){
      return item[$scope.orderBar];
    }else{
      return 0;
    }
  };
  /*Create Topic Modal*/
  $scope.loadMore=function(){
    console.log('load more');
  };
  $scope.saveTopic=function(topic){
    TopicService.addItem($scope.topics,$scope.eventId,topic);
  };
  $scope.vote=function(id,value){
    TopicService.vote(id,value);
    $ionicListDelegate.closeOptionButtons();
    //write function for keeping scroll fixed on it. 
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
})
.controller('SurveyCtrl',function($scope,$state,$ionicSlideBoxDelegate,SurveyService){
  $scope.survey={};
  $scope.slideIndex=0;
  $scope.complete = function() {
    SurveyService.saveSurvey($scope.survey);
    $state.go('app.browse');
  };
  $scope.next = function() {
    console.log('next');
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
