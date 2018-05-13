
    // Wait for device API libraries to load
    //
    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    // device APIs are available
    function onDeviceReady() {
        // Handle results
        function startRecognition(){
            window.plugins.speechRecognition.startListening(function(result){
        // Show results in the console
        console.log(result);
    }, function(err){
        console.error(err);
    }, {
        language: "en-US",
        showPopup: true
    });
        }

// Verify if recognition is available
window.plugins.speechRecognition.isRecognitionAvailable(function(available){
    if(!available){
        console.log("Sorry, not available");
    }

    // Check if has permission to use the microphone
    window.plugins.speechRecognition.hasPermission(function (isGranted){
        if(isGranted){
            startRecognition();
        }else{
            // Request the permission
            window.plugins.speechRecognition.requestPermission(function (){
                // Request accepted, start recognition
                startRecognition();
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
