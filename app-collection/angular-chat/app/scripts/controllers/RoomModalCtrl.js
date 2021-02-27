(function() {
    function RoomModalCtrl(Room, User, $uibModalInstance, $cookies) {
        var modal = this;

        modal.chatRoomArray = Room.all;
        modal.statusBar = "Enter a room name";
        modal.privateRoom = false;
        modal.currentUserId = $cookies.get('blocChatCurrentUser');
        modal.currentUserObj = User.getUserobj(modal.currentUserId);

        modal.addData = function(){
            if(modal.inputData && (/\S+/.test(modal.inputData))){
                Room.addNewRoom(modal.currentUserId, modal.inputData, modal.privateRoom, modal.currentUserObj.username);
                modal.cancel();
            } else {
                alert("Room name should not be empty.");
            }
        };

        modal.cancel = function(){
            $uibModalInstance.dismiss('cancel');
        };


    }

    angular
        .module('blocChat')
        .controller('RoomModalCtrl', ['Room', 'User', '$uibModalInstance', '$cookies', RoomModalCtrl]);
})();
