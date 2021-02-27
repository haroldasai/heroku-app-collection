(function() {
    function AccountModalCtrl($cookies, $uibModal, $uibModalInstance, $rootScope, Auth, User) {
      var vim = this;
      this.status = undefined;
      this.firstname = "";
      this.lastname = "";
      this.username = "";
      this.openSignInModal = function(){
        $uibModalInstance.dismiss('cancel');
        $uibModal.open({
          // Modal configuration object properties
          animation: true,
          templateUrl: 'templates/signin_modal.html',
          controller: 'SignInModalCtrl',
          controllerAs: 'signinmodal'
        });
      };

      this.createAccount = function() {
        if((!this.firstname && !this.lastname) || !(/\S+/.test(this.firstname + this.lastname))){
          this.errorStatus = "*Name field should not be empty";
        } else if(!this.email || (/\s+/.test(this.email))){
          this.errorStatus = "*E-mail should not be empty or contains white space";
        } else if(!this.password || (/\s+/.test(this.password))){
          this.errorStatus = "*Please set your password (no white space allowed)";
        } else if(!this.passwordconfirm || (/\s+/.test(this.passwordconfirm))){
          this.errorStatus = "*Please confirm your password";
        } else if(this.password !== this.passwordconfirm) {
          this.errorStatus = "*Password unmatched";
        } else {
          if(vim.firstname && (/\S+/.test(this.firstname))){
            vim.username = vim.firstname;
          }
          if(vim.lastname && (/\S+/.test(this.lastname))){
            if(vim.username){
              vim.username += " ";
            }
            vim.username += vim.lastname;
          }

          var obj = Auth.createUser(this.email, this.password);
          obj.then(function(firebaseUser) {
            User.addUser(firebaseUser.uid, vim.email, vim.firstname, vim.lastname, vim.username);
            console.log("User " + firebaseUser.uid + " created successfully!");
            vim.status = "User created successfully!";
            vim.errorStatus = "";
            vim.firstname = "" ; vim.lastname = ""; vim.email = ""; vim.password = ""; vim.passwordconfirm = "";
          }).catch(function(error) {
            console.error("Error: ", error);
            vim.errorStatus = "Oops..error has occured. Please try it again.";
          });
        }
      };
    }

    angular
        .module('blocChat')
        .controller('AccountModalCtrl', ['$cookies', '$uibModal', '$uibModalInstance', '$rootScope', 'Auth', 'User', AccountModalCtrl]);
})();
