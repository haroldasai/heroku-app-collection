(function() {
  function Message($firebaseArray, $firebaseObject) {
    var ref = firebase.database().ref().child("messages");
    var messages = $firebaseArray(ref);

    return {
      getByRoomId: function (roomId) {
        // Filter the messages by their room ID.
        var array = $firebaseArray(ref.orderByChild("roomId").equalTo(roomId));
        return array;
      },

      send: function (newMessage, roomname, time, userId, usrname) {
        messages.$add({content: newMessage, roomId: roomname, sentAt: time, userid: userId, username: usrname}).then(function(ref) {
          var id = ref.key;
          console.log("added new message with id " + id);
          messages.$indexFor(id); // returns location in the array
        });
      },

      killPopup: function(userId) {
        ref.child(userId).remove();
      },

      typingPopup: function(newMessage, roomname, time, userId, usrname) {
        var popUpMessage = $firebaseArray(ref.child(userId));
        popUpMessage.$loaded().then(function(){
          if(!popUpMessage[3]) {
            ref.child(userId).set({content: newMessage, roomId: roomname, sentAt: time, userid: userId, username: usrname}).then(function() {
              console.log("added new message with id " + userId);
              console.log(popUpMessage.userid);
              setTimeout(function(){
                ref.child(userId).remove().then(function(){
                  console.log("Message with id " + userId + " has been deleted.");
                });
              },5000);
            });
          }
        });
      }
    };
  }

  angular
    .module('blocChat')
    .factory('Message', ['$firebaseArray', '$firebaseObject', Message]);
})();
