(function() {
  function Auth($firebaseAuth) {
    var object = {};
    var authObj = $firebaseAuth();

    object.createUser = function(email, password){
      return authObj.$createUserWithEmailAndPassword(email, password);
    };

    object.signIn = function(email, password){
      return authObj.$signInWithEmailAndPassword(email, password);
    };

    return object;
  }

  angular
    .module('blocChat')
    .factory('Auth', ['$firebaseAuth', Auth]);
})();
