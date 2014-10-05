'use strict';
// Ionic Starter App, v0.9.20
/*jshint unused:vars */
// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('Bullet3', [
  'ionic',
  'config',
  'Bullet3.controllers',
  'Bullet3.directives',
  'Bullet3.services',
  'Bullet3.filters',
  'firebase',
  'firebase.utils',
  'AuthenticationService',
  'Bullet3.accountControllers',
  'stateSecurity'
])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    // if(window.cordova && window.cordova.plugins.Keyboard) {
    //   cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    // }
    // if(window.StatusBar) {
    //   // org.apache.cordova.statusbar required
    //   StatusBar.styleDefault();
    // }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('intro',{
      url:'/intro',
      templateUrl:'templates/intro.html',
      controller:'IntroCtrl'
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl'
    })
    .state('app.account',{
      url:'/account',
      views:{
        'menuContent':{
          templateUrl:'templates/account.html',
          controller:'AccountCtrl'
        }
      },
      data:{
        authRequired: true
      },
      resolve: {
        // forces the page to wait for this promise to resolve before controller is loaded
        // the controller can then inject `user` as a dependency. This could also be done
        // in the controller, but this makes things cleaner (controller doesn't need to worry
        // about auth status or timing of displaying its UI components)
        user: ['simpleLogin', function(simpleLogin) {
          return simpleLogin.getUser();
        }]
      }
    })
    .state('app.create',{
      url:'/create',
      views:{
        'menuContent':{
          templateUrl:'templates/create.html',
          controller:'CreateCtrl'
        }
      }
    })
    .state('app.search', {
      url: '/search',
      views: {
        'menuContent' :{
          templateUrl: 'templates/search.html'
        }
      }
    })
    .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent' :{
          templateUrl: 'templates/browse.html',
          controller: 'BrowseCtrl'
        }
      }
    })
    .state('app.survey',{
      url:'/survey',
      views:{
        'menuContent':{
          templateUrl:'templates/survey.html',
          controller:'SurveyCtrl'
        }
      }
    })
    .state('app.feed', {
      url: '/event/:eventId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/feed.html',
          controller: 'FeedCtrl'
        }
      }
    })
    .state('app.topic', {
      url: '/event/:eventId/topic/:topicId',
      views: {
        'menuContent' :{
          templateUrl: 'templates/topic.html',
          controller: 'TopicCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/intro');
});