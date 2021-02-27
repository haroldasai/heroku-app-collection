(function() {
    function MainCtrl(Room, Message, $uibModal, $cookies, $scope, User, Auth, $window) {
        var vim = this;
        this.currentUserId = $cookies.get('blocChatCurrentUser');
        this.currentUserPassword = $cookies.get('blocChatCurrentPassword');
        this.userArray = User.all;
        this.roomArray = Room.all;
        this.animationsEnabled = true;
        this.currentRoomTitle = "";
        this.currentRoomId = "";
        this.currentUserObj;
        this.currentAuthObj;
        this.currentUsername = "";//$cookies.get('blocChatCurrentUser')"";
        this.hidePublicRooms = false;
        this.hidePrivateRooms = false;
        this.publicRoomsFolder = "-Public rooms";
        this.privateRoomsFolder = "-Private rooms";
        this.currentPrivateRoom = "private room"

        this.timerObj;
        var offlineTracker;
        var timeout = 900000;

        this.resetTimer = function(){
          clearTimeout(vim.timerObj);
          vim.timerObj = setTimeout(vim.signOut, timeout);
          console.log('sign out timer reseted.');
        };

        if(this.currentUserId && this.currentUserPassword) {
          vim.currentUserObj = User.getUserobj(this.currentUserId);
          vim.currentUserObj.$loaded().then(function(userobj){
            console.log(userobj);
            console.log(userobj.username);
            var obj = Auth.signIn(userobj.email, vim.currentUserPassword);
            obj.then(function(firebaseUser) {
              console.log("Signed in as:", firebaseUser.uid);
              vim.currentAuthObj = firebaseUser;
              vim.welcome = "Welcome ";
              vim.currentUsername = userobj.username;
              vim.currentRoomTitle = "Select a chat room";
              vim.publicRoomArray = Room.publicRooms;
              vim.privateRoomArray = User.privateRooms(vim.currentUserId);
              User.markOnline(firebaseUser.uid, true);
              vim.timerObj = setTimeout(vim.signOut, timeout);

              offlineTracker = User.getUserref(vim.currentUserId);
              offlineTracker.on('value', function(snapshot){
                if(snapshot.val()==false){
                  $window.location.reload();
                }
              });

            }).catch(function(error) {
              console.error("Authentication failed:", error);
              $uibModal.open({
                // Modal configuration object properties
                animation: true,
                templateUrl: 'templates/signin_modal.html',
                controller: 'SignInModalCtrl',
                controllerAs: 'signinmodal'
              })
            });

          });
        }

        $scope.$on('AUTHOBJ', function(events, authObj){
          vim.timerObj = setTimeout(vim.signOut, timeout);
          vim.currentAuthObj = authObj;
          console.log(authObj.uid);
          vim.currentUserId = authObj.uid;
          offlineTracker = User.getUserref(vim.currentUserId);
          offlineTracker.on('value', function(snapshot){
            if(snapshot.val()==false){
              $window.location.reload();
            }
          });
          vim.currentUserObj = User.getUserobj(authObj.uid);
          vim.currentUserObj.$loaded().then(function(userobj){
            console.log(userobj);
            console.log(userobj.username);
            vim.welcome = "Welcome "
            vim.currentUsername = userobj.username;
            vim.currentRoomTitle = "Select a chat room";
            vim.publicRoomArray = Room.publicRooms;
            vim.privateRoomArray = User.privateRooms(vim.currentUserId);
          });
        });



        this.openNewRoomModal = function(){
          var modalInstance = $uibModal.open({
              animation: this.animationsEnabled,
              templateUrl: 'templates/new_room_modal.html',
              controller: 'RoomModalCtrl',
              controllerAs: 'roommodal'
          });
        };

        this.openPrivateRoomModal = function(roomid, roomname) {
          $cookies.put('currentRoomId', roomid);
          $cookies.put('currentRoomName', roomname);
          var prmodalInstance = $uibModal.open({
              animation: this.animationsEnabled,
              templateUrl: 'templates/private_room_modal.html',
              controller: 'PrivateRoomModalCtrl',
              controllerAs: 'proommodal'
          });
        };

        this.setCurrentRoom = function(name, id, privateroom) {
          this.currentRoomTitle = name;
          this.currentRoomId = id;
          this.messageArray = Message.getByRoomId(id);
          if(privateroom == true){
            this.currentPrivateRoom = '"';
            this.currentPrivateRoom += name;
            this.currentPrivateRoom += '"';
            this.privateUserArray = Room.privateUserArray(id);
          } else {
            this.currentPrivateRoom = "private room";
            this.privateUserArray = undefined;
          }
        };

        this.sendMessage = function() {
          if(this.currentRoomId=="") {
            this.message = "";
            alert("Please select a chat room.");
          } else {
            Message.killPopup(this.currentUserId);
            var currentTime = getTime();
            Message.send(this.message, this.currentRoomId, currentTime, this.currentUserId, this.currentUsername);
            this.message = "";
          }
        };

        var getTime = function(){
          var date=new Date();
          var year = date.getFullYear();
          var month = date.getMonth()+1;
          var week = date.getDay();
          var day = date.getDate();
          var hour = date.getHours();
          var minute = date.getMinutes();
          var second = date.getSeconds();
          return month+"/"+day+"/"+year+"/"+" "+ hour+":"+minute;
        };

        this.messageStyle = function(userid){
          if(this.currentUserId == userid) {
            return {
                     "float": "right",
                     "background-color": "rgb(230, 230, 230)"
            };

          }
        }

        this.signOut = function() {
          $cookies.remove('blocChatCurrentUser');
          $cookies.remove('blocChatCurrentPassword');
          User.markOnline(vim.currentUserId, false);
          $window.location.reload();
        };

        $scope.onExit = function() {
          User.markOnline(vim.currentUserId, false);
        };

        this.setPublicRooms = function() {
          if(this.hidePublicRooms) {
            this.hidePublicRooms = false;
            this.publicRoomsFolder = "-Public rooms";
          } else {
            this.hidePublicRooms = true;
            this.publicRoomsFolder = "+Public rooms";
          }
        };

        this.setPrivateRooms = function() {
          if(this.hidePrivateRooms) {
            this.hidePrivateRooms = false;
            this.privateRoomsFolder = "-Private rooms";
          } else {
            this.hidePrivateRooms = true;
            this.privateRoomsFolder = "+Private rooms";
          }
        };

        this.checkProomMember = function(userObj){
          if(this.privateUserArray) {
            for(var i = 0; i < this.privateUserArray.length; i++){
              if(this.privateUserArray[i].$id == userObj.$id){
                return true;
              }
            }
          }
          return false;
        };

        this.deletePublicRoom = function(roomId){
          var r = confirm("Are you sure you want to delete this room?");
          if(r) {
            Room.deletePublicRoom(roomId);
          }
        };

        this.deletePrivateRoom = function(roomId){
          var r = confirm("Are you sure you want to delete this room?");
          if(r) {
            Room.deletePrivateRoom(roomId);
          }
        };

        this.getRoomFounder = function(roomId) {
          return this.roomArray.$getRecord(roomId).founder;
        };

        this.typingPopup = function() {
          vim.resetTimer();
          Message.typingPopup( this.currentUsername + " is typing...", this.currentRoomId, "", this.currentUserId, "");
        };

        $window.onbeforeunload = $scope.onExit;
    }

    angular
        .module('blocChat')
        .controller('MainCtrl', ['Room', 'Message', '$uibModal', '$cookies', '$scope', 'User', 'Auth', '$window', MainCtrl]);

})();
