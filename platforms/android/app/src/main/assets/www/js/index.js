var recongnition = 0;
var cornerimage;
var artyom;
var currentIP="192.168.43.130";
var queryUrl= "http://"+currentIP+"/DistributedPlayer-Client/admin/ajax.php?q=";
var musicUrl= "http://"+currentIP+"/DistributedPlayer-Client/Client/music/";
window.onkeydown = function(e) {
    return !(e.keyCode == 32);
};

// Wait for device API libraries to load
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}


function askforIP(){
console.log("inside ASK FOR IP");
currentIP = window.prompt("Insert Server IP", "192.168.");
if(!validateIPaddress(CurrentIP)){
askforIP();
}
console.log("FINISH ASK FOR IP");

flag=false;
}
function validateIPaddress(ipaddress) {
  if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    return (true)
  }
  alert("You have entered an invalid IP address!")
  return (false)
}
// device APIs are available
function onDeviceReady() {
    // Handle results
    artyom = new Artyom();
    initAmplitude();
    // Verify if recognition is available
    window.plugins.speechRecognition.isRecognitionAvailable(function(available) {
        if (!available) {
            console.log("Sorry, not available");
        }

        // Check if has permission to use the microphone
        window.plugins.speechRecognition.hasPermission(function(isGranted) {
            if (isGranted) {
                console.log("recognition is isGranted");
            } else {
                // Request the permission
                window.plugins.speechRecognition.requestPermission(function() {
                    // Request accepted, start recognition
                    console.log("recognition accepted");
                }, function(err) {
                    console.log(err);
                });
            }
        }, function(err) {
            console.log(err);
        });
    }, function(err) {
        console.log(err);
    });

}

function startRecognition() {
    window.plugins.speechRecognition.startListening(function(result) {
        result.forEach(function(option) {
            if (artyom.simulateInstruction(option)) {
                console.log("Matched : " + option, result);
                return;
            }
        });

        console.log(result);
    }, function(err) {
        console.error(err);
    }, {
        language: "en-US",
        showPopup: false
    });
}


function adjustScreen() {
    var appSize = $('#player-screen').height();
    var screenSize = $(window).height();
    var newButtomSize = 0;
    if (appSize != screenSize) {

        if (appSize < screenSize) {
            newButtomSize = screenSize - (appSize - $('#player-bottom').height());
            $('#player-bottom').height(newButtomSize);
        } else if (appSize > screenSize) {
            newButtomSize = screenSize - (appSize - $('#player-bottom').height());
            var imgHeight = $('#player-top').height();
            imgHeight = imgHeight - (appSize - screenSize);
            $('#player-top').height(imgHeight);
        }

    }
}

//Secondes to minutes
function fmtMSS(s) {
    var tmpTime = (s - (s %= 60)) / 60 + (9 < s ? ':' : ':0') + s;
    var newPosition = tmpTime.indexOf(":") + 3;
    return tmpTime.substring(0, newPosition);
}

function toggleRecognition() {
    if (recongnition === 0) {
        //Active recognition for 5 sec
        setTimeout(function() {
            stopListeningBtnColor();
        }, 3500);
        startListeningBtnColor();
    } else {
        stopListeningBtnColor();
    }

}

function initAmplitude() {
    initMusicList();
    cornerimage = $(".cornerimage");
    adjustScreen();

    /*
    Handles a click on the down button to slide down the playlist.
    */
    $('.down-header').on('click', function() {
        /*
          Sets the list's height;
          */
        $('#list').css('height', (parseInt($('#flat-black-player-container').height()) - 135) + 'px');

        /*
          Slides down the playlist.
          */
        $('#list-screen').slideDown(500, function() {
            $(this).show();
        });
    });

    /*
      Handles a click on the up arrow to hide the list screen.
      */
    $('.hide-playlist').on('click', function() {
        $('#list-screen').slideUp(500, function() {
            $(this).hide();
        });
    });

    /*
      Handles a click on the song played progress bar.
      */
    document.getElementById('song-played-progress').addEventListener('click', function(e) {
        var offset = this.getBoundingClientRect();
        var x = e.pageX - offset.left;

        Amplitude.setSongPlayedPercentage((parseFloat(x) / parseFloat(this.offsetWidth)) * 100);
    });

    $('img[amplitude-song-info="cover_art_url"]').css('height', $('img[amplitude-song-info="cover_art_url"]').width() + 'px');

}



$(window).on('resize', function() {
    $('img[amplitude-song-info="cover_art_url"]').css('height', $('img[amplitude-song-info="cover_art_url"]').width() + 'px');
});



function stopListeningBtnColor() {
    cornerimage.attr('src', "img/microphone-0.svg");
    recongnition = 0;
}


function startListeningBtnColor() {

    cornerimage.attr('src', "img/microphone-1.svg");
    recongnition = 1;
    startRecognition();
}

function initMusicList() {
    var musicList = "";
    var secondes = 0;
    $.ajax({
        url: queryUrl + "songs",
        success: function(result) {
            initAmplitudeList(result);
            $.each(result, function(key, value) {
                var sound = document.createElement('audio');
                sound.id = 'audio-player';
                sound.controls = 'controls';
                sound.src = musicUrl + value['filename'] + '.mp3';
                sound.type = 'audio/mpeg';
                sound.onloadedmetadata = function() {
                    secondes = sound.duration;
                    musicList = '<div class="song amplitude-song-container amplitude-play-pause" amplitude-song-index="' + key + '">' +
                        '                  <span class="song-number-now-playing">' +
                        '                    <span class="number">' + (key + 1) + '</span>' +
                        '                    <img class="now-playing" src="img/now-playing.svg"/>' +
                        '                  </span>' +
                        '' +
                        '                  <div class="song-meta-container">' +
                        '                    <span class="song-name">' + value['title'] + '</span>' +
                        '                    <span class="song-artist-album">' + value['album'] + '</span>' +
                        '                  </div>' +
                        '' +
                        '                  <span class="song-duration">' +
                        '                    ' + fmtMSS(secondes) + '' +
                        '                  <span>' +
                        '                </div>' +
                        '';
                    $("#list").append(musicList);
                }; // End Of onloadmetadata

            }); // End of Each
            delete sound;
        }
    }); //initMusicList End

}

function radio(){
Amplitude.pause();
libVLCPlayer.play('rtsp://@'+currentIP+':5551/radio',{
                                                           autoPlay: true,
                                                           hideControls: true
                                                       });


}

function television(){
Amplitude.pause();
libVLCPlayer.play('rtsp://@'+currentIP+':5550/tele',{
                                                           autoPlay: true,
                                                           hideControls: true
                                                       });


}

function initAmplitudeList(result) {
    var songs = [];
    var artyomCommandes = [{
            indexes: ['start', 'Play music'],
            action: (i) => {
                Amplitude.play();
            }
        },
        {
            indexes: ['stop', 'Pause', 'Hold On', 'Stop music'],
            action: (i) => {
                Amplitude.pause();
            }
        },
        {
            indexes: ['up up', 'up'],
            action: (i) => {
                Amplitude.volumeUp();
            }
        },
        {
            indexes: ['next', 'Go on', 'next Song'],
            action: (i) => {
                Amplitude.next();
            }
        },
        {
            indexes: ['Go back', 'Previous', 'Previous song'],
            action: (i) => {
                Amplitude.prev();
            }
        }
    ];
    $.each(result, function(key, value) {
        var oneSong = {
            "name": value['title'],
            "artist": value['artist'],
            "album": value['album'],
            "url": musicUrl + value['filename'] + '.mp3',
            "cover_art_url": value['image']
        };

        songs.push(oneSong);
        artyomCommandes.push({
            indexes: ["play " + value['artist'] + " " + value['title'], "play " + value['title'], "Please Play " + value['title'], "I want to listen to " + value['title']],
            action: (i) => {
                Amplitude.playNow(oneSong);
            }
        });

        artyom.addCommands(artyomCommandes);


    });
    Amplitude.init({
        "bindings": {
            37: 'prev',
            39: 'next',
            32: 'play_pause'
        },
        "songs": songs
    });


}