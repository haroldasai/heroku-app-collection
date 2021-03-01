 (function() {
     function SongPlayer($rootScope, Fixtures) {
         var SongPlayer = {};

         var currentAlbum = Fixtures.getAlbum();
         var currentVolume = 80;
         /**
         * @desc Buzz object audio file
         * @type {Object}
         */
         var currentBuzzObject = null;

         /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */
         var setSong = function(song) {
             if (currentBuzzObject) {
                 currentVolume = currentBuzzObject.getVolume();
                 stopSong(SongPlayer.currentSong);
                 /*
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
                 */
             }

             currentBuzzObject = new buzz.sound(song.audioUrl, {
                 formats: ['mp3'],
                 preload: true,
                 volume: currentVolume
             });

             SongPlayer.muteOn = false;

             currentBuzzObject.bind('timeupdate', function() {

                 //call autoPlay() if auto-play slider is on
                 if(SongPlayer.autoPlayOn) {
                     if(this.isEnded()) {
                         SongPlayer.autoPlay();
                     }
                 }

                 //update currentTIme
                 $rootScope.$apply(function() {
                     SongPlayer.currentTime = currentBuzzObject.getTime();
                 });
             });

             currentBuzzObject.bind('volumechange', function() {
                 $rootScope.$apply(function() {
                     SongPlayer.volume = currentBuzzObject.getVolume();
                 });
             });


             SongPlayer.currentSong = song;
         };

         /**
         * @function playSong
         * @desc Play audio file stored in currentBuzzObject and set playing attribute to true
         * @param {Object} song
         */
         var playSong = function(song) {
             currentBuzzObject.play();
             song.playing = true;
         };

         var stopSong = function(song) {
             currentBuzzObject.stop();
             song.playing = null;
         }


         var getSongIndex = function(song) {
              return currentAlbum.songs.indexOf(song);
         };

         /**
         * @desc Active song object from list of songs
         * @type {Object}
         */
         SongPlayer.currentSong = null;

         /**
         * @desc Current playback time (in seconds) of currently playing song
         * @type {Number}
         */
         SongPlayer.currentTime = null;

         /**
         * @desc volume (in percentile) of currently playing song
         * @type {Number}
         */
         SongPlayer.volume = null;

         SongPlayer.autoPlayOn = false;

         SongPlayer.muteOn = false;

         /**
         * @function setFirstSong
         * @desc set first song of the album on page load.
         * @param {Object} album
         */
         SongPlayer.setFirstSong = function(album) {
             setSong(album.songs[0]);
         };

         /**
         * @function play
         * @desc set new song and play if current song is not equal to the new song. Play current audio file if current song is equal to new song and the audio file is paused.
         * @param {Object} song
         */
         SongPlayer.play = function(song) {
             song = song || SongPlayer.currentSong;
             if (SongPlayer.currentSong !== song) {
                 setSong(song);
                 playSong(song);
                 /*
                 currentBuzzObject.play();
                 song.playing = true;
                 */
             } else if (SongPlayer.currentSong === song) {
                 if (currentBuzzObject.isPaused()) {
                     playSong(song);
                     /*
                     currentBuzzObject.play();
                     song.playing = true; // should report to bloc???
                     */
                 }
             }
         };

         /**
         * @function pause
         * @desc pause current audio file and set playing attribute to false.
         * @param {Object} song
         */
         SongPlayer.pause = function(song) {
             song = song || SongPlayer.currentSong;
             currentBuzzObject.pause();
             song.playing = false;
         };

         /**
         * @function next
         * @find next song and play it.
         */
         SongPlayer.next = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex++;

             if (currentSongIndex >= Fixtures.getAlbum().songs.length) {
                 stopSong(SongPlayer.currentSong);
                 /*
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
                 */
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };

         /**
         * @function previous
         * @find previous song and play it.
         */
         SongPlayer.previous = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex--;

             if (currentSongIndex < 0) {
                 stopSong(SongPlayer.currentSong);
                 /*
                 currentBuzzObject.stop();
                 SongPlayer.currentSong.playing = null;
                 */
             } else {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };

         /**
         * @function autoPlay
         * @desc autoplay next song after current song has ended
         */
         SongPlayer.autoPlay = function() {
             var currentSongIndex = getSongIndex(SongPlayer.currentSong);
             currentSongIndex++;

             if (currentSongIndex < Fixtures.getAlbum().songs.length) {
                 var song = currentAlbum.songs[currentSongIndex];
                 setSong(song);
                 playSong(song);
             }
         };

         /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
         SongPlayer.setCurrentTime = function(time) {
             if (currentBuzzObject) {
                 currentBuzzObject.setTime(time);
             }
         };

         SongPlayer.setVolume = function(volume) {
             if (currentBuzzObject) {
                 currentBuzzObject.setVolume(volume);
             }
         };

         SongPlayer.getCurrentVolume = function() {
             if (currentBuzzObject) {
                 return currentBuzzObject.getVolume();
             }
         };

         SongPlayer.setMute = function() {
             if (currentBuzzObject) {
                 SongPlayer.muteOn = true;
                 currentBuzzObject.mute();
             }
         };

         SongPlayer.setUnMute = function() {
             if (currentBuzzObject) {
                 SongPlayer.muteOn = false;
                 currentBuzzObject.unmute();
             }
         };

         return SongPlayer;
     }

     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
