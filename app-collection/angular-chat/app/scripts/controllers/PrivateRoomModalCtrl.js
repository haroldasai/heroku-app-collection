(function() {
    function PrivateRoomModalCtrl(Room, User, $uibModalInstance, $cookies) {
      var vim = this;
      var currentRoomId = $cookies.get('currentRoomId');
      var currentRoomName = $cookies.get('currentRoomName');
      var inRoomUsers = Room.privateUserArray(currentRoomId);
      vim.userArray = User.all;
      vim.userArrayFiltered = [];
      vim.inviteUsersObj = {};
      vim.userArray.$loaded().then(function(){
        inRoomUsers.$loaded().then(function(){
          if(vim.userArray.length == inRoomUsers.length){
            vim.noUser = "No user to invite.";
          }
        });
      });

      vim.checkProomMember = function(userObj) {
        for(var i = 0; i < inRoomUsers.length; i++){
          if(inRoomUsers[i].$id == userObj.$id){
            return true;
          }
        }
        return false;
      };

/*
      userArray.$loaded().then(function(){
        for(var i = 0; i < userArray.length; i++){
          vim.userArrayFiltered.push(userArray[i]);
        }
        inRoomUsers.$loaded().then(function(){
          for(var i = 0; i < inRoomUsers.length; i++) {
            if(userArray.$getRecord(inRoomUsers[i].participant_key)) {
              vim.userArrayFiltered.splice(findIndexFor(vim.userArrayFiltered, inRoomUsers[i].participant_key), 1);
            }
          }
        });
      });
*/

      vim.cancel = function(){
        $uibModalInstance.dismiss('cancel');
      };

      vim.pushUser = function(userId, userName){
        if(vim.inviteUsersObj[userId]){
          delete vim.inviteUsersObj[userId];
        } else {
          vim.inviteUsersObj[userId] = userName;
        }
      };

      vim.registerUsers = function() {
        for(var item in vim.inviteUsersObj) {
          Room.addUserToRoom(currentRoomId, currentRoomName, item, vim.inviteUsersObj[item]);
        }
        $uibModalInstance.dismiss('cancel');
      };

    }

    angular
        .module('blocChat')
        .controller('PrivateRoomModalCtrl', ['Room', 'User', '$uibModalInstance', '$cookies', PrivateRoomModalCtrl]);
})();
