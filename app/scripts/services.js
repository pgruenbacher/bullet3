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
.factory('ApiService',function($http){
  var uploadUrl='http://paulgruenbacher.com/bullet-feed/api/upload';
  return{
    uploadFileToUrl:function(file){
      var fd = new FormData();
      fd.append('image', file);
      fd.append('author', 'authorID');
      return $http.post(uploadUrl, fd, {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined}
      });
    }
  };
})
.factory('TopicService',function($firebase,ENV){
  var _url=ENV.FB+'eventsList';
  var _ref=new Firebase(_url);

  var _url2=ENV.FB+'topicsList';
  var _ref2=new Firebase(_url2);
  var topicsCache;
  var eventCache;
  return{
    trending:function(){

    },
    recent:function(){

    },
    syncAll:function(eventName){
      //var topics= $firebase(_ref.child(eventName).child('topics'));
      //var eventTopics=$firebase(_ref.child(eventName).child('topics'));
      var topics=Firebase.util.intersection({
        ref:_ref.child(eventName+'/topics').limit(100).startAt(null,'-JXs8vHkQfYQ7bzd_NAf')
      },{
        ref:_ref2.limit(100).startAt(null,'-JXs8vHkQfYQ7bzd_NAf')
      });
      _ref2.startAt(null,'-JXs8vHkQfYQ7bzd_NAf').on('child_added',function(snapshot){
        console.log('snap',snapshot.name());
      });
      if(typeof topicsCache !=='undefined' && eventName === eventCache){
        console.log('cache');
        eventCache=eventName;
        return topicsCache;
      }
      topicsCache=$firebase(topics).$asArray();
      eventCache=eventName;
      return topicsCache;
    },
    addItem: function(topics,eventId,topic){
      topic.author='pgruenbacher';
      topic.timestamp=Firebase.ServerValue.TIMESTAMP;
      topic.votes=0;
      topics.$add(topic).then(function(ref){
        var id=ref.name();
        _ref.child(eventId+'/topics/'+id).set(true);
        //Add author to here as well
      });
    },
    get:function(id){
      return $firebase(_ref2.child(id)).$asObject();
    },
    vote:function(id,value){
      _ref2.child(id+'/votes').transaction(function(votes){
        return votes+value;
      });
    },
    saveItem:function(){

    },
    deleteItem: function(id){
    }
  };
})
.factory('SurveyService',function($firebase,ENV){
  var _url=ENV.FB+'surveyList';
  var _ref=new Firebase(_url);
  return{
    saveSurvey:function(survey){
      _ref.push(survey);
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
      comment.timestamp=Firebase.ServerValue.TIMESTAMP;
      comments.$add(comment).then(function(ref){
        var id=ref.name();
        _ref.child(topicId+'/comments/'+id).set(true);
        //Add author to here as well
      });
    },
    vote:function(id,value){
      _ref2.child(id+'/votes').transaction(function(votes){
        return votes+value;
      });
    },
    saveItem:function(){

    },
    deleteItem: function(id){
    }
  };
})
.factory('changeEmail',function(fbutil, $q) {
  return function(password, oldEmail, newEmail, simpleLogin) {
    var ctx = { old: { email: oldEmail }, curr: { email: newEmail } };
    // execute activities in order; first we authenticate the user
    function authOldAccount() {
      return simpleLogin.login(ctx.old.email, password).then(function(user) {
        ctx.old.uid = user.uid;
      });
    }

    function loadOldProfile() {
      var def = $q.defer();
      ctx.old.ref = fbutil.ref('users', ctx.old.uid);
      ctx.old.ref.once('value',
        function(snap){
          var dat = snap.val();
          if( dat === null ) {
            def.reject(oldEmail + ' not found');
          }
          else {
            ctx.old.name = dat.name;
            def.resolve();
          }
        },
        function(err){
          def.reject(err);
        });
      return def.promise;
    }

    function createNewAccount() {
      return simpleLogin.createAccount(ctx.curr.email, password, ctx.old.name).then(function(user) {
        ctx.curr.uid = user.uid;
      });
    }

    function copyProfile() {
      var d = $q.defer();
      ctx.curr.ref = fbutil.ref('users', ctx.curr.uid);
      var profile = {email: ctx.curr.email, name: ctx.old.name||''};
      ctx.curr.ref.set(profile, function(err) {
        if (err) {
          d.reject(err);
        } else {
          d.resolve();
        }
      });
      return d.promise;
    }

    function removeOldProfile() {
      var d = $q.defer();
      ctx.old.ref.remove(function(err) {
        if (err) {
          d.reject(err);
        } else {
          d.resolve();
        }
      });
      return d.promise;
    }

    function removeOldLogin() {
      var def = $q.defer();
      simpleLogin.removeUser(ctx.old.email, password).then(function() {
        def.resolve();
      }, function(err) {
        def.reject(err);
      });
      return def.promise;
    }

    function authNewAccount() {
      return simpleLogin.login(ctx.curr.email, password);
    }
    return authOldAccount()
      // then we fetch old account details
      .then( loadOldProfile )
      // then we create a new account
      .then( createNewAccount )
      // then we copy old account info
      .then( copyProfile )
      // and once they safely exist, then we can delete the old ones
      // we have to authenticate as the old user again
      .then( authOldAccount )
      .then( removeOldProfile )
      .then( removeOldLogin )
      // and now authenticate as the new user
      .then( authNewAccount )
      .catch(function(err) { console.error(err); return $q.reject(err); });
  };
});
