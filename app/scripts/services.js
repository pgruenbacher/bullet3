'use strict';
/*jshint unused: vars */
/* global Firebase*/
angular.module('Bullet3.services',[])
.factory('EventsService', function($firebase){
  var _url='https://bullet.firebaseio.com/eventsList';
  var _ref= new Firebase(_url);
  return{
    syncAll:function(){
      var sync = $firebase(_ref);
      return sync.$asArray();
    },
    addItem: function(item){
      _ref.push(item);
    },
    removeAll: function(){
      _ref.remove();
    },
    deleteItem: function(id){
      var itemRef = new Firebase(_url + '/' + id);
      itemRef.remove();
    }
  };
})
.factory('ChatService',function($firebase){
  var _url='https://bullet.firebaseio.com/events';
  var _ref=new Firebase(_url);
  return{
    trending:function(){

    },
    recent:function(){

    },
    syncAll:function(eventName){
      var sync= $firebase(_ref.child(eventName));
      return sync.$asArray();
    }
  };
});