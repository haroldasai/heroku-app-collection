 (function() {
     function Fixtures() {
         var Fixtures = {};

         var albumPuerta = {
             title: 'Puerta Best',
             artist: 'Puerta',
             label: 'Puerta Records',
             year: '2010',
             albumArtUrl: 'assets/images/album_covers/01.png',
             songs: [
                 { title: 'Puerta Rising', duration: 84, audioUrl: 'assets/music/puerta/Puerta Rising' },
                 { title: 'Turn me on', duration: 153, audioUrl: 'assets/music/puerta/Turn me on' },
                 { title: 'Let me out', duration: 294, audioUrl: 'assets/music/puerta/Let me out' },
                 { title: 'Another Night in the City', duration: 235, audioUrl: 'assets/music/puerta/Another Night in the City' },
                 { title: 'Twilight', duration: 303, audioUrl: 'assets/music/puerta/Twilight' },
                 { title: 'Whats the use', duration: 245, audioUrl: 'assets/music/puerta/Whats the use' },
                 { title: 'Nice and Slow', duration: 201, audioUrl: 'assets/music/puerta/Nice and Slow' },
                 { title: 'Leave them far behined', duration: 76, audioUrl: 'assets/music/puerta/Leave them far behind' },
                 { title: 'Waste no Time', duration: 283, audioUrl: 'assets/music/puerta/Waste no Time' }
             ]
         };

         var albumPicasso = {
             title: 'The Colors',
             artist: 'Pablo Picasso',
             label: 'Cubism',
             year: '1881',
             albumArtUrl: 'assets/images/album_covers/02.png',
             songs: [
                 { title: 'Blue', duration: 161.71, audioUrl: 'assets/music/blue' },
                 { title: 'Green', duration: 103.96, audioUrl: 'assets/music/green' },
                 { title: 'Red', duration: 268.45, audioUrl: 'assets/music/red' },
                 { title: 'Pink', duration: 153.14, audioUrl: 'assets/music/pink' },
                 { title: 'Magenta', duration: 374.22, audioUrl: 'assets/music/magenta' }
             ]
         };

 // Another Example Album
         var albumMarconi = {
             title: 'The Telephone',
             artist: 'Guglielmo Marconi',
             label: 'EM',
             year: '1909',
             albumArtUrl: 'assets/images/album_covers/20.png',
             songs: [
                 { title: 'Hello, Operator?', duration: '1:01' },
                 { title: 'Ring, ring, ring', duration: '5:01' },
                 { title: 'Fits in your pocket', duration: '3:21'},
                 { title: 'Can you hear me now?', duration: '3:14' },
                 { title: 'Wrong phone number', duration: '2:15'}
             ]
         };

         Fixtures.getAlbum = function() {
             return albumPuerta;
         };

         Fixtures.getCollection = function(numberOfAlbums) {
             var arr = [];
             for(var i = 0; i < numberOfAlbums; i++) {
                 arr.push(albumPuerta);
             }
             return arr;
         };


         return Fixtures;
     }

     angular
         .module('blocJams')
         .factory('Fixtures', Fixtures);
 })();
