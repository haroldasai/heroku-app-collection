(function() {
  function User($firebaseObject, $firebaseArray, $cookies) {
    var rootRef = firebase.database();
    var ref = firebase.database().ref().child("users");
    var users = $firebaseArray(ref.orderByChild("online"));
    //var rooms = $firebaseArray(ref);

    return {
      addUser: function (userId, emailAddress, firstName, lastName, userName) {
        ref.child(userId).set({
          email: emailAddress,
          firstname: firstName,
          lastname: lastName,
          username: userName,
          online: false,
          privateRoom: {}
        });
        console.log("User " + userName + " has created with id " + userId);
      },

      markOnline: function (userId, boo) {
        if(boo){
          ref.child(userId).child('online').set(true);
        } else {
          ref.child(userId).child('online').set(false);
        }
      },

      getUserobj: function(userId) {
        var userobj = $firebaseObject(rootRef.ref("users/"+userId));
        userobj.$loaded().then(function(userobj){
          console.log(userobj);
          console.log(userobj.username);
        });
        return userobj;
      },

      getUserref: function(userId) {
        return rootRef.ref("users/"+userId+"/online");
      },

      privateRooms: function(userId) {
        return $firebaseArray(ref.child(userId).child('privaterooms'));
      },

      all: users
    };
  }

  angular
    .module('blocChat')
    .factory('User', ['$firebaseObject', '$firebaseArray', '$cookies', User]);
})();
