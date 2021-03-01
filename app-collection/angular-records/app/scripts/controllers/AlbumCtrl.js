 (function() {
     function AlbumCtrl(Fixtures, SongPlayer) {
         this.albumData = Fixtures.getAlbum();
         this.songPlayer = SongPlayer;
         this.songPlayer.setFirstSong(this.albumData);
     }

     angular
         .module('blocJams')
         .controller('AlbumCtrl', ['Fixtures', 'SongPlayer', AlbumCtrl]);
 })();
