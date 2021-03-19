const progressValue = document.querySelector('.Progressbar__value');
const progress = document.querySelector('progress');


function setValue(value) {
  progressValue.style.width = `${value}%`;
  progress.value = value;
}

function millisToMinutesAndSeconds(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function hide_unhide(hide) {
  if (hide){
    var x = document.getElementById("Progressbar");
    x.style.display = "none";
  }else{
    var x = document.getElementById("Progressbar");
    x.style.display = "block";
  }


}
$.getJSON('http://localhost:7777/config', function(song_data) {})

setInterval(function(){$.getJSON('http://localhost:7777/update', function(song_data) {
  if (song_data == null){
    hide_unhide(true);
    document.getElementById('song_name').innerHTML = "There is no music playing.";
    document.getElementById('artists').innerHTML = "Spotify";
    document.getElementById("banner").src = "static/img/spotify-logo.png";
  }else{
          if (song_data.currently_playing_type == 'ad')
          {
              hide_unhide(true);
              document.getElementById('song_name').innerHTML = "Spotify Ad.";
              document.getElementById('artists').innerHTML = "Spotify";
              document.getElementById("banner").src = "static/img/spotify-logo.png";
          }
          else
          {
            if (song_data.is_playing){
              hide_unhide(false);
              // get song name.
              song_name = song_data.item.name;
              document.getElementById('song_name').innerHTML = song_name;

              // get song artists
              for (var i=0; i < song_data.item.artists.length; i++)
              {
                var artists = String(artists + ", "+ song_data.item.artists[i].name + ".");
              }
              artists = artists.substring(artists.indexOf(" ") + 1);
              document.getElementById('artists').innerHTML = artists;

              // get song thumbnail
              var image_object = song_data.item.album.images[1]
              document.getElementById("banner").src = image_object.url;

              // NOTE: display the audio progress.
              var duration_m = millisToMinutesAndSeconds(song_data.item.duration_ms - 1000);
              var progress_m = millisToMinutesAndSeconds(song_data.progress_ms - 1000);
              // document.getElementById("duration_m").innerHTML = duration_m;
              // document.getElementById("progress_m").innerHTML = progress_m;


              var percentage = ((song_data.progress_ms - 1000) / (song_data.item.duration_ms - 1000)) * 100
              setValue(percentage)
            }
            else{
              hide_unhide(true);
              document.getElementById('song_name').innerHTML = "Paused " + song_name;
              document.getElementById('artists').innerHTML = "Spotify";
              document.getElementById("banner").src = "static/img/spotify-logo.png";

            }
          }
        }
});
}, 1000)
