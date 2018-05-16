cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
  {
    "id": "cordova-plugin-speechrecognition.SpeechRecognition",
    "file": "plugins/cordova-plugin-speechrecognition/www/speechRecognition.js",
    "pluginId": "cordova-plugin-speechrecognition",
    "merges": [
      "window.plugins.speechRecognition"
    ]
  },
  {
    "id": "com.hutchind.cordova.plugins.streamingmedia.StreamingMedia",
    "file": "plugins/com.hutchind.cordova.plugins.streamingmedia/www/StreamingMedia.js",
    "pluginId": "com.hutchind.cordova.plugins.streamingmedia",
    "clobbers": [
      "streamingMedia"
    ]
  },
  {
    "id": "cordova-plugin-libvlc.VideoPlayerVLC",
    "file": "plugins/cordova-plugin-libvlc/www/libVLCPlayer.js",
    "pluginId": "cordova-plugin-libvlc",
    "clobbers": [
      "window.libVLCPlayer"
    ]
  },
  {
    "id": "cordova-plugin-tts.tts",
    "file": "plugins/cordova-plugin-tts/www/tts.js",
    "pluginId": "cordova-plugin-tts",
    "clobbers": [
      "TTS"
    ]
  }
];
module.exports.metadata = 
// TOP OF METADATA
{
  "cordova-plugin-whitelist": "1.3.3",
  "cordova-plugin-speechrecognition": "1.1.2",
  "com.hutchind.cordova.plugins.streamingmedia": "0.1.4",
  "cordova-plugin-libvlc": "0.1.3",
  "cordova-plugin-tts": "0.2.3"
};
// BOTTOM OF METADATA
});