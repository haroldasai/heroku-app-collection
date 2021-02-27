(function() {
  function BlocChatCookies($cookies, $uibModal) {
    var currentUser = $cookies.get('blocChatCurrentUser');
    if (!currentUser || currentUser === '') {
      // Do something to allow users to set their username
      $uibModal.open({
        // Modal configuration object properties
        animation: true,
        templateUrl: 'templates/signin_modal.html',
        controller: 'SignInModalCtrl',
        controllerAs: 'signinmodal'
      })
    }
  }

  angular
    .module('blocChat')
    .run(['$cookies', '$uibModal', BlocChatCookies]);
})();
