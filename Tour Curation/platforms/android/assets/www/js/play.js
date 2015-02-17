var app = {
  initialize: function() {
      this.bindEvents();
  },
  bindEvents: function() {
    var query = window.location.search.split("=")[1];

    if(!query) {
      return;
    }

    this.loadXML("img/tc" + query + ".xml");

    var targetImg = document.getElementById("menuImage");
    targetImg.src = "img/tc" + query + ".jpg";

    document.getElementById("playNum").textContent = query;

    var passwd = window.location.pathname.split("Playing")[0];

    var played = false,
        playing = false,
        stopElement = document.createElement("img"),
        startElement = document.createElement("img");
    stopElement.src = "img/UIBarButtonPause.png";
    startElement.src ="img/UIBarButtonPlay.png";

    var element = document.getElementById("playBtn");

    element.addEventListener("click", function() {
      if(!query) {
        return;
      }

      if(!played) {
        playAudio(passwd + "img/tc" + query + ".mp3");
        element.removeChild( element.firstElementChild );
        element.appendChild(stopElement);
        played = true;
        playing = true;
        return;
      }

      if(playing) {

        pauseAudio();
        playing = false;
        element.removeChild( element.firstElementChild );
        element.appendChild(startElement);

      } else {

        my_media.play();
        playing = true;
        element.removeChild( element.firstElementChild );
        element.appendChild(stopElement);

      }
    });

    document.getElementById("rewindBtn").addEventListener("click", function() {
      back15s();
    });

    document.getElementById("fastBtn").addEventListener("click", function() {
      fast15s();
    });

    document.getElementById("navBack").addEventListener("click", function() {
      if(!my_media) {
        return;
      }
      stopAudio();
    });    
  },
  onDeviceReady: function() {
  },
  receivedEvent: function(id) {
  },
  loadXML: function(url) {
      var xmlhttp;

      if (window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest();
      } else {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
      }
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
          var collect = xmlhttp.responseXML.firstChild,
          title = collect.firstElementChild.textContent,
          content = collect.lastElementChild.textContent;

          content = content.replace(/\\n/g, "</br>");

          document.getElementById("playTitle").textContent = title;
          document.getElementById("playContent").innerHTML = content;
        }
      }

      xmlhttp.open("GET", url, true);
      xmlhttp.send();
  }
};

// Audio player
//
var my_media = null;
var mediaTimer = null;
// Play audio
//
function playAudio(src) {
    // Create Media object from src
    my_media = new Media(src, onSuccess, onError, onStatusChange);

    // Play audio
    my_media.play();

    // Update my_media position every second
    if (mediaTimer == null) {
        mediaTimer = setInterval(function() {
            // get my_media position
            my_media.getCurrentPosition(
                // success callback
                function(position) {
                    if (position > -1) {
                        setAudioPosition((position) + " sec");
                    }
                },
                // error callback
                function(e) {
                    console.log("Error getting pos=" + e);
                    setAudioPosition("Error: " + e);
                }
            );
        }, 1000);
    }
    // onError Callback
    //
    var onError = function(error) {
      if(my_media) {
        stopAudio();
        my_media.seekTo(0);
        playAudio(src);
      }
    }
}

// Pause audio
//
function pauseAudio() {
    if (my_media) {
        my_media.pause();
    }
}

// Stop audio
//
function stopAudio() {
    if (my_media) {
        my_media.stop();
    }
    clearInterval(mediaTimer);
    mediaTimer = null;
}

// onSuccess Callback
//
function onSuccess() {
    console.log("playAudio():Audio Success");
}

// Set audio position
//
function setAudioPosition(position) {
    document.getElementById('audio_position').innerHTML = position;
}

// fast 15s position
function fast15s() {
  if(my_media) {
    my_media.getCurrentPosition(                
      // success callback
      function(position) {
          if (position > -1) {
            var target = position * 1000 + 15000;
            my_media.seekTo(target);
            setAudioPosition((position + 15) + " sec");
          }
      },
      // error callback
      function(e) {
          console.log("Error getting pos=" + e);
          setAudioPosition("Error: " + e);
      }
    );
  }
}

// back 15s position
function back15s() {
  if(my_media) {
    my_media.getCurrentPosition(                
      // success callback
      function(position) {
          if (position > 15) {
            var target = position - 15;
            my_media.seekTo(target * 1000);
            setAudioPosition((position - 15) + " sec");
          } else {
            my_media.seekTo(0);
            setAudioPosition(0 + " sec");
          }
      },
      // error callback
      function(e) {
          console.log("Error getting pos=" + e);
          setAudioPosition("Error: " + e);
      }
    );
  }
}

function onStatusChange(status) {
  if(status == Media.MEDIA_STOPPED) {
    var element = document.getElementById("playBtn"),
        startElement = document.createElement("img");
    startElement.src = "img/UIBarButtonPlay.png";

    element.removeChild( element.firstElementChild );
    element.appendChild(startElement);
  } else {
    return;
  }
}