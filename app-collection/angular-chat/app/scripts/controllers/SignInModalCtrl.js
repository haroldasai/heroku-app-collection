(function() {
    function SignInModalCtrl($cookies, $uibModal, $uibModalInstance, Auth, $rootScope, User) {
      var vim = this;
      this.openNewAccountModal = function(){
        $uibModalInstance.dismiss('cancel');
        $uibModal.open({
          // Modal configuration object properties
          animation: true,
          templateUrl: 'templates/new_account_modal.html',
          controller: 'AccountModalCtrl',
          controllerAs: 'accountmodal'
        });
      };

      this.signIn = function(){
        if(!this.email || !(/\S+/.test(this.email))){
          this.errorStatus = "*E-mail should not be empty";
        } else if(!this.password || !(/\S+/.test(this.password))){
          this.errorStatus = "*Please enter your password";
        } else {
          var obj = Auth.signIn(this.email, this.password);
          obj.then(function(firebaseUser) {
            console.log("Signed in as:", firebaseUser.uid);
            vim.signInStatus = "Logged in successfully...";
            vim.errorStatus = "";
            $cookies.put('blocChatCurrentUser', firebaseUser.uid);
            $cookies.put('blocChatCurrentPassword', vim.password);
            User.markOnline(firebaseUser.uid, true);
            setTimeout(function(){$uibModalInstance.dismiss('cancel');}, 2000);
            $rootScope.$broadcast('AUTHOBJ', firebaseUser);
          }).catch(function(error) {
            console.error("Authentication failed:", error);
            vim.errorStatus = "Authentication failed.";
          });
        }
      };
    }

    angular
        .module('blocChat')
        .controller('SignInModalCtrl', ['$cookies', '$uibModal', '$uibModalInstance', 'Auth', '$rootScope', 'User', SignInModalCtrl]);
})();
