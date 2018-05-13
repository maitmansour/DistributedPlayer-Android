var recongnition=0;
var cornerimage;
var artyom;

window.onkeydown = function(e) {
  return !(e.keyCode == 32);
};

// Wait for device API libraries to load
function onLoad() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

// device APIs are available
function onDeviceReady() {
    // Handle results
    artyom = new Artyom();
    initAmplitude();
// or add some commandsDemostrations in the normal way
artyom.addCommands([
{
    indexes: ['Hello','Hi','is someone there'],
    action: (i) => {
        console.log("Hello, it's me");
    }
},
{
    indexes: ['Repeat after me *'],
    smart:true,
    action: (i,wildcard) => {
        console.log("You've said : "+ wildcard);
    }
},
    // The smart commands support regular expressions
    {
        indexes: [/Good Morning/i],
        smart:true,
        action: (i,wildcard) => {
            console.log("You've said : "+ wildcard);
        }
    },

    {
        indexes: ["play Luis Fonsi Despacito","playDespacito","Please Play Despacito"],
        action: (i) => {
          Amplitude.playNow({
            "name" : "Despacito",
            "artist"  : "Luis Fonsi",
            "album"       : "Daddy K - The Mix 11",
            "url"       : "http://192.168.1.59/DistributedPlayer-Client/Client/music/a9be4c2a152598297288682717210977633.mp3",
            "cover_art_url"       : "http://lastfm-img2.akamaized.net/i/u/174s/e32888ca155d4dca5193c614ae817af5.png"
        });
      }
  },
  {
    indexes: ["play Eagles Hotel California","playHotel California","Please Play Hotel California"],
    action: (i) => {
      Amplitude.playNow({
        "name" : "Hotel California",
        "artist"  : "Eagles",
        "album"       : "Eagles",
        "url"       : "http://192.168.1.59/DistributedPlayer-Client/Client/music/3483e5ec152598305248291534310181978.mp3",
        "cover_art_url"       : "http://lastfm-img2.akamaized.net/i/u/174s/ec559161068a480699519195e06af1e7.png"
    });
  }
},
{
    indexes: ["play Adele Hello","playHello","Please Play Hello"],
    action: (i) => {
      Amplitude.playNow({
        "name" : "Hello",
        "artist"  : "Adele",
        "album"       : "Hello",
        "url"       : "http://192.168.1.59/DistributedPlayer-Client/Client/music/dc363817152606792094116671710036258.mp3",
        "cover_art_url"       : "http://lastfm-img2.akamaized.net/i/u/174s/79521634782f16bf04b530761613af1f.png"
    });
  }
}, 
]);


// Verify if recognition is available
window.plugins.speechRecognition.isRecognitionAvailable(function(available){
    if(!available){
        console.log("Sorry, not available");
    }

    // Check if has permission to use the microphone
    window.plugins.speechRecognition.hasPermission(function (isGranted){
        if(isGranted){
            console.log("recognition is isGranted")
        }else{
            // Request the permission
            window.plugins.speechRecognition.requestPermission(function (){
                // Request accepted, start recognition
                console.log("recognition accepted")
            }, function (err){
                console.log(err);
            });
        }
    }, function(err){
        console.log(err);
    });
}, function(err){
    console.log(err);
});

}

function startRecognition(){
    window.plugins.speechRecognition.startListening(function(result){
      result.forEach(function(option){
        if(artyom.simulateInstruction(option)){
            console.log("Matched : " + option, result);
            return;
        }
    });

      console.log(result);
  }, function(err){
    console.error(err);
}, {
    language: "en-US",
    showPopup: false
});
}


function adjustScreen(){
  var appSize=$('#player-screen').height();
  var screenSize=$( window ).height();
  var newButtomSize=0;
  if (appSize!=screenSize) {

    if (appSize<screenSize) {
       newButtomSize=screenSize-(appSize-$('#player-bottom').height());
       $('#player-bottom').height(newButtomSize);
   }else if (appSize>screenSize) {
       newButtomSize=screenSize-(appSize-$('#player-bottom').height());
       var imgHeight = $('#player-top').height();
       imgHeight=imgHeight-(appSize-screenSize);
       $('#player-top').height(imgHeight);
   }

}
}

//Secondes to minutes
function fmtMSS(s){var tmpTime= (s-(s%=60))/60+(9<s?':':':0')+s;
var newPosition = tmpTime.indexOf(":")+3;
return tmpTime.substring(0, newPosition); }


function updateDuration(){
  $(".song-duration").each(function() {
    var duration_div = $( this );
    var musicUrl = duration_div.text();
    duration_div.text('');
    var sound      = document.createElement('audio');
    sound.id       = 'audio-player';
    sound.controls = 'controls';
    sound.src      = musicUrl;
    sound.type     = 'audio/mpeg';
    var secondes;
    sound.onloadedmetadata = function() {
      secondes=sound.duration;
      duration_div.text(fmtMSS(secondes));
  }
  delete sound;
});
}



function toggleRecognition(){
  if (recongnition==0) {
    //Active recognition for 5 sec
    setTimeout(function(){
      stopListeningBtnColor();
  }, 3000);
    startListeningBtnColor();
}else{
    stopListeningBtnColor();  
}

}


function initAmplitude() {
  updateDuration();
  cornerimage= $( ".cornerimage" );
  adjustScreen();

    /*
    Handles a click on the down button to slide down the playlist.
    */
    $('.down-header').on('click', function(){
    /*
      Sets the list's height;
      */
      $('#list').css('height', ( parseInt( $('#flat-black-player-container').height() ) - 135 )+ 'px' );

    /*
      Slides down the playlist.
      */
      $('#list-screen').slideDown(500, function(){
        $(this).show();
    });
  });

  /*
    Handles a click on the up arrow to hide the list screen.
    */
    $('.hide-playlist').on('click', function(){
      $('#list-screen').slideUp( 500, function(){
        $(this).hide();
    });
  });

  /*
    Handles a click on the song played progress bar.
    */
    document.getElementById('song-played-progress').addEventListener('click', function( e ){
      var offset = this.getBoundingClientRect();
      var x = e.pageX - offset.left;

      Amplitude.setSongPlayedPercentage( ( parseFloat( x ) / parseFloat( this.offsetWidth) ) * 100 );
  });

    $('img[amplitude-song-info="cover_art_url"]').css('height', $('img[amplitude-song-info="cover_art_url"]').width() + 'px' );

}



$(window).on('resize', function(){
  $('img[amplitude-song-info="cover_art_url"]').css('height', $('img[amplitude-song-info="cover_art_url"]').width() + 'px' );
});



function stopListeningBtnColor()
{
  cornerimage.attr('src', "img/microphone-0.svg");
  recongnition=0;  
}


function startListeningBtnColor(){

  cornerimage.attr('src', "img/microphone-1.svg");
  recongnition=1;
  startRecognition();
}