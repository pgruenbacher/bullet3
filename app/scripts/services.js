'use strict';
/*jshint unused: vars */
/* global Firebase*/
angular.module('Bullet3.services',[])
.factory('EventsService', function($firebase,ENV){
  var _url= ENV.FB+'eventsList';
  var _ref= new Firebase(_url);
  return{
    syncAll:function(){
      var sync = $firebase(_ref);
      return sync.$asArray();
    },
    addItem: function(sync,item){
      sync.$add(item);
    },
    deleteItem: function(id){
      var itemRef = new Firebase(_url + '/' + id);
      itemRef.$remove();
    }
  };
})
.factory('TopicService',function($firebase,ENV){
  var _url=ENV.FB+'eventsList';
  var _ref=new Firebase(_url);

  var _url2=ENV.FB+'topicsList';
  var _ref2=new Firebase(_url2);
  return{
    trending:function(){

    },
    recent:function(){

    },
    syncAll:function(eventName){
      //var topics= $firebase(_ref.child(eventName).child('topics'));
      //var eventTopics=$firebase(_ref.child(eventName).child('topics'));
      var topics=Firebase.util.intersection(_ref.child(eventName+'/topics'),_ref2);
      return $firebase(topics).$asArray();
    },
    addItem: function(topics,eventId,topic){
      topic.author='pgruenbacher';
      topic.$priority=0;
      topic.timestamp=new Date().getTime();
      topic.noComments=0;
      topics.$add(topic).then(function(ref){
        var id=ref.name();
        _ref.child(eventId+'/topics/'+id).set(true);
        //Add author to here as well
      });
    },
    saveItem:function(){

    },
    deleteItem: function(id){
    }
  };
})
.factory('CommentService',function($firebase,ENV){
  var _url=ENV.FB+'topicsList';
  var _ref=new Firebase(_url);

  var _url2=ENV.FB+'commentsList';
  var _ref2=new Firebase(_url2);
  return{
    trending:function(){

    },
    recent:function(){

    },
    syncAll:function(topicId){
      var comments=Firebase.util.intersection(_ref.child(topicId+'/comments'),_ref2);
      return $firebase(comments).$asArray();
    },
    addItem: function(comments,topicId,comment){
      comment.author='pgruenbacher';
      comment.$priority=0;
      comment.timestamp=new Date().getTime();
      comment.noComments=0;
      comments.$add(comment).then(function(ref){
        var id=ref.name();
        _ref.child(topicId+'/comments/'+id).set(true);
        //Add author to here as well
      });
    },
    saveItem:function(){

    },
    deleteItem: function(id){
    }
  };
});