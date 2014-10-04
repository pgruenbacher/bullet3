'use strict';
/*jshint unused: vars */
angular.module('AuthenticationService',[])
.factory('simpleLogin',function($firebaseSimpleLogin, fbutil, createProfile, changeEmail, $q, $rootScope){
  var auth = $firebaseSimpleLogin(fbutil.ref(),function(err,user){
    console.log('user',user);
  });
  var listeners = [];
  function statusChange() {
    fns.getUser().then(function(user) {
      fns.user = user || null;
      angular.forEach(listeners, function(fn) {
        fn(user||null);
      });
    });
  }
  var fns={
    user:null,
    getUser:function(){
      console.log(auth.$getCurrentUser());
      return auth.$getCurrentUser();
    },
    /**
    * @param {string} email
    * @param {string} pass
    * @returns {*}
    */
    loginMethod:function(method){
      var options;
      switch(method){
        case 'facebook':
          options={rememberMe:true,};
          break;
        case 'google':
          options={rememberMe:true};
          break;
      }
      return auth.$login(method,options);
    },
    login:function(email,pass){
      return auth.$login('password',{
        email: email,
        password: pass,
        rememberMe: true
      });
    },
    logout: function(){
      auth.$logout();
    },
    createAccount:function(email,pass,name){
      return auth.$createUser(email,pass)
        .then(function(){
          //authenicate so we have permission to write to Firebase
          return fns.login(email,pass);
        })
        .then(function(user){
          return createProfile(user.uid,email,name).then(function(){
            return user;
          });
        });
    },
    changePassword:function(email,oldPass,newPass){
      return auth.$changePassword(email,oldPass,newPass);
    },
    changeEmail: function(password,newEmail){
      return changeEmail(password,fns.user.email,newEmail,this);
    },
    removeUser:function(email,pass){
      return auth.$removeUser(email,pass);
    },
    watch:function(cb,$scope){
      fns.getUser().then(function(user){
        cb(user);
      });
      listeners.push(cb);
      var unbind=function(){
        var i=listeners.indexOf(cb);
        if(i>-1){listeners.splice(i,1);}
      };
      if($scope){
        $scope.$on('$destroy',unbind);
      }
      return unbind;
    }
  };
  $rootScope.$on('$firebaseSimpleLogin:login',statusChange);
  $rootScope.$on('$firebaseSimpleLogin:logout',statusChange);
  $rootScope.$on('$firebaseSimpleLogin:error',statusChange);
  statusChange();
  return fns;
})
.factory('createProfile',function(fbutil,$q,$timeout){
  return function(id,email,name){
    var ref=fbutil.ref('users',id),
    def=$q.defer();
    function ucfirst(str){
      str +='';
      var f=str.charAt(0).toUpperCase();
      return f+ str.substr(1);
    }
    function firstPartOfEmail(email){
      return ucfirst(email.substr(0,email.indexOf('@'))||'');
    }
    ref.set({
      email:email,
      name: name || firstPartOfEmail(email)
    },function(err){
      $timeout(function(){
        if(err){
          def.reject(err);
        }
        else{
          def.resolve(ref);
        }
      });
    });
    
    return def.promise;
  };
});