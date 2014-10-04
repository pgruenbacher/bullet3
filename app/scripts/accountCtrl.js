'use strict';
/*jshint unused:vars */
angular.module('Bullet3.accountControllers', [])
.controller('LoginCtrl', function($scope, simpleLogin, $state) {
  $scope.email = null;
  $scope.pass = null;
  $scope.confirm = null;
  $scope.createMode = false;
  $scope.loginData={};
  $scope.login = function(email, pass) {
    $scope.err = null;
    simpleLogin.login(email, pass)
      .then(function(/* user */) {
        $scope.modal.hide();
      }, function(err) {
        $scope.err = errMessage(err);
      });
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    console.log('destroy',$scope.loginModal.remove());
  });
  $scope.createAccount = function() {
    $scope.err = null;
    if( assertValidAccountProps() ) {
      simpleLogin.createAccount($scope.email, $scope.pass)
        .then(function(/* user */) {
          $scope.closeLogin();
          $state.go('app.account');
        },function(err) {
            $scope.err = errMessage(err);
          });
    }
  };
  function assertValidAccountProps() {
    if(!$scope.email) {
      $scope.err = 'Please enter an email address';
    }
    else if(!$scope.pass || !$scope.confirm) {
      $scope.err = 'Please enter a password';
    }
    else if($scope.createMode && $scope.pass !== $scope.confirm) {
      $scope.err = 'Passwords do not match';
    }
    return !$scope.err;
  }
  function errMessage(err) {
    return angular.isObject(err) && err.code? err.code : err + '';
  }
})
.controller('AccountCtrl',function($scope, simpleLogin, fbutil, user, $state) {
  // create a 3-way binding with the user profile object in Firebase
  var profile = fbutil.syncObject(['users', user.uid]);
  profile.$bindTo($scope, 'profile');
  function resetMessages() {
    $scope.err = null;
    $scope.msg = null;
    $scope.emailerr = null;
    $scope.emailmsg = null;
  }
  // expose logout function to scope
  $scope.logout = function() {
    profile.$destroy();
    simpleLogin.logout();
    $state.go('intro');
  };
  $scope.changePassword = function(pass, confirm, newPass) {
    resetMessages();
    if( !pass || !confirm || !newPass ) {
      $scope.err = 'Please fill in all password fields';
    }
    else if( newPass !== confirm ) {
      $scope.err = 'New pass and confirm do not match';
    }
    else {
      simpleLogin.changePassword(profile.email, pass, newPass)
        .then(function() {
          $scope.msg = 'Password changed';
        }, function(err) {
          $scope.err = err;
        });
    }
  };
  $scope.clear = resetMessages;
  $scope.changeEmail = function(pass, newEmail) {
    resetMessages();
    profile.$destroy();
    simpleLogin.changeEmail(pass, newEmail)
      .then(function(user) {
        profile = fbutil.syncObject(['users', user.uid]);
        profile.$bindTo($scope, 'profile');
        $scope.emailmsg = 'Email changed';
      }, function(err) {
        $scope.emailerr = err;
      });
  };
});