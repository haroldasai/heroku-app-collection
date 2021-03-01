 (function() {
     function config($stateProvider, $locationProvider) {
         $locationProvider
             .html5Mode({
                 enabled: true,
                 requireBase: false
             });
         
         $stateProvider
             .state('landing', {
                 url: '/angular-records/',
                 controller: 'LandingCtrl as landing',
                 templateUrl: '/angular-records/templates/landing.html'
             })
             .state('album', {
                 url: '/angular-records/album',
                 controller: 'AlbumCtrl as album',
                 templateUrl: '/angular-records/templates/album.html'
             })
             .state('collection', {
                 url: '/angular-records/collection',
                 controller: 'CollectionCtrl as collection',
                 templateUrl: '/angular-records/templates/collection.html'
             });
             
     }
     
     angular
         .module('blocJams', ['ui.router'])
         .config(config);
 })();
