(function() {
  function Room($firebaseArray) {
    var object = {};

    var ref = firebase.database().ref().child("rooms");
    var publicArray = $firebaseArray(ref.orderByChild("private").equalTo(false));
    var privateArray = $firebaseArray(ref.orderByChild("private").equalTo(true));
    var rooms = $firebaseArray(ref);

    object.all = rooms;
    object.publicRooms = publicArray;
    object.privateRooms = privateArray;

    object.addNewRoom = function(founderId, roomName, privateRoom, username) {
        rooms.$add({founder: founderId, name: roomName, private: privateRoom}).then(function(reff) {
          var id = reff.key;
          console.log("added "+ roomName + " with id " + id)
          rooms.$indexFor(id); // returns location in the array
          if(privateRoom == true) {
            ref.child(id).child("participants").child(founderId).child('participant_username').set(username).then(function(refff){
              console.log("added a participant "+ username + " with id " + founderId);
            });
            /*ref.child(id).child("participants").push({participant_key: founderId, participant_username: username}).then(function(refff){
              console.log("added a participant "+ username + " with id " + founderId);
            });*/
            /*var userref = firebase.database().ref().child("users").child(founderId).child('privateroom');
            userref.push({roomkey: id, roomname: roomName}).then(function(ref) {
              console.log("added "+ roomName + " with id " + id + " in userDB");
            });*/
            var userref = firebase.database().ref().child("users").child(founderId).child('privaterooms').child(id).child('roomname');
            userref.set(roomName).then(function(ref) {
              console.log("added "+ roomName + " with id " + id + " in userDB");
            });
          }
        });
    };

    object.addUserToRoom = function(roomId, roomName, userId, userName) {
      ref.child(roomId).child("participants").child(userId).child('participant_username').set(userName).then(function(refff){
        console.log("added a participant "+ userName + " to room "+roomId);
      });

      var userref = firebase.database().ref().child("users").child(userId).child('privaterooms').child(roomId).child('roomname');
      userref.set(roomName).then(function(ref) {
        console.log("added "+ roomName + " with id " + roomId + " in userDB");
      });
    };

    object.privateUserArray = function(roomId) {
      return $firebaseArray(ref.child(roomId).child("participants"));
    };

    object.deletePublicRoom = function(roomId) {
      ref.child(roomId).remove().then(function(){
        console.log("Room with id " + roomId + " was deleted.");
      });
    };

    object.deletePrivateRoom = function(roomId) {
      var userref = firebase.database().ref().child("users");
      var participantsArray = $firebaseArray(ref.child(roomId).child('participants'));
      participantsArray.$loaded().then(function(){
        for(var i = 0; i < participantsArray.length; i++) {
          userref.child(participantsArray[i].$id).child('privaterooms').child(roomId).remove().then(function(){
            console.log("Room with id " + roomId + " was removed from the user " + participantsArray[i].participant_username );
          });
        }

        ref.child(roomId).remove().then(function(){
          console.log("Room with id " + roomId + " was deleted.");
        });
      });
    };

    return object;
  }

  angular
    .module('blocChat')
    .factory('Room', ['$firebaseArray', Room]);
})();
