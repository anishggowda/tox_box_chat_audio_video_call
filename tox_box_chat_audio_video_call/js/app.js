/* global API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL OT */
/* eslint-disable no-alert */

var apiKey;
var session;
var sessionId;
var token;
var flag=0;
var publisher;
function publisher_video(){
   // Initialize the publisher
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    publishAudio: true,
    publishVideo: true,
    frameRate: 25,
    resolution: '1280x720',
    audioBitrate:50000,
  };
  publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(initErr) {
          console.log('inint publisher');
    if (initErr) {
      console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
      return;
    }
  });

  session.publish(publisher, function publishCallback(publishErr) {
                  console.log('session publisher');
        if (publishErr) {
          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
        }
      });

  // Connect to the session
  session.connect(token, function callback(error) {
              console.log('socket connect');
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, function publishCallback(publishErr) {
                  console.log('session publisher');
        if (publishErr) {
          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
        }
      });
    } else {
      console.error('There was an error connecting to the session: ', error.name, error.message);
    }
  });

}


function publisher_audio(){
   // Initialize the publisher
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%',
    publishAudio: true,
    videoSource: null,
    audioBitrate:50000,
  };
  publisher = OT.initPublisher('publisher', publisherOptions, function initCallback(initErr) {
          console.log('inint publisher');
    if (initErr) {
      console.error('There was an error initializing the publisher: ', initErr.name, initErr.message);
      return;
    }
  });

  session.publish(publisher, function publishCallback(publishErr) {
                  console.log('session publisher');
        if (publishErr) {
          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
        }
      });
  // Connect to the session
  session.connect(token, function callback(error) {
              console.log('socket connect');
    // If the connection is successful, initialize a publisher and publish to the session
    if (!error) {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, function publishCallback(publishErr) {
                  console.log('session publisher');
        if (publishErr) {
          console.error('There was an error publishing: ', publishErr.name, publishErr.message);
        }
      });
    } else {
      console.error('There was an error connecting to the session: ', error.name, error.message);
    }
  });


}




function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    console.log('subscribe');
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%',
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, function callback(error) {
      console.log('session subscribe');
      if (error) {
        console.error('There was an error publishing: ', error.name, error.message);
      }
    });
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.error('You were disconnected from the session.', event.reason);
  });
  // Connect to the session
  session.connect(token, function callback(error) {
              console.log('socket connect');
  });


  // Receive a message and append it to the history
  var msgHistory = document.querySelector('#history');
  session.on('signal:msg', function signalCallback(event) {
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
  });

  session.on('signal:calling', function signalCallback(event) {
        console.log('signal calling');
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    if (event.from.connectionId === session.connection.connectionId) {
      msgHistory.appendChild(msg);
      msg.scrollIntoView();
    } else {
      var button = document.getElementById('demo_btn');
      button.click();
      var button1 = document.getElementById('video_play');
            var button2 = document.getElementById('video_play1');
            button2.play();
            button1.appendChild(button2);

    }
  });

    session.on('signal:calling_audio', function signalCallback(event) {
        console.log('signal calling audio');
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    if (event.from.connectionId === session.connection.connectionId) {
      msgHistory.appendChild(msg);
      msg.scrollIntoView();
    } else {
      var button = document.getElementById('demo_btn1');
      button.click();
      var button1 = document.getElementById('audio_play2');
      var button2 = document.getElementById('audio_play22');
      button2.play();
      button1.appendChild(button2);

    }

  });

session.on('signal:call_cut_audio', function signalCallback(event) {
              console.log('signal reject');
      var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
msgHistory.appendChild(msg);
      msg.scrollIntoView();
      window.location.reload();
  });

    session.on('signal:reject', function signalCallback(event) {
              console.log('signal reject');
      var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
msgHistory.appendChild(msg);
      msg.scrollIntoView();
  });

    session.on('signal:reject_audio', function signalCallback(event) {
              console.log('signal reject audio');
      var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
msgHistory.appendChild(msg);
      msg.scrollIntoView();
  });

session.on('signal:destroy', function signalCallback(event) {
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
    window.location.reload();
  });

  var videos = document.querySelector('#videos');
  var videos_parent = document.querySelector('#videos_parent');
  var accept = document.getElementById('accept_btn');
  session.on('signal:accept', function signalCallback(event) {
     publisher_video();
    console.log('signal accept');
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
    videos.style.display = "block";
        videos_parent.style.display= "block"
    videos_parent.appendChild(videos);
    var button = document.getElementById('modalActivate');
     // button.click();

  });

var videos = document.querySelector('#videos');
  var videos_parent = document.querySelector('#videos_parent');
  var accept = document.getElementById('accept_btn1');
    var video_btn = document.querySelector('#vid-btn');
        // var shruthi = document.querySelector('.shruthi');
  session.on('signal:accept_call', function signalCallback(event) {
         publisher_audio();
    console.log('signal accept audio');
    var msg = document.createElement('p');
    msg.textContent = event.data;
    msg.className = event.from.connectionId === session.connection.connectionId ? 'mine' : 'theirs';
    msgHistory.appendChild(msg);
    msg.scrollIntoView();
    videos.style.display = "block";
    videos_parent.style.display= "block";
    video_btn.style.display="none";
    // shruthi.appendChild(video_btn);
    videos_parent.appendChild(videos);
    var button = document.getElementById('modalActivate');
      //button.click();

  });
}




// Text chat
var form = document.querySelector('form');
var msgTxt = document.querySelector('#msgTxt');

// Send a signal once the user enters data in the form
form.addEventListener('submit', function submit(event) {
  event.preventDefault();

  session.signal({
    type: 'msg',
    data: msgTxt.value
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
});



function call_video() {
  // publisher_video();
  event.preventDefault();
  console.log('calling');
  session.signal({
    type: 'calling',
    data: 'calling ......'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
}



function accept_video() {
  // publisher_video();
    console.log('accept');
  var button2 = document.getElementById('video_play1');
  button2.pause();
  event.preventDefault();
  session.signal({
    type: 'accept',
    data: 'video call has been connected'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });

}


function accept_audio() {
  // publisher_audio();
    console.log('accept audio');
  var button2 = document.getElementById('audio_play22');
  button2.pause();
  event.preventDefault();
  session.signal({
    type: 'accept_call',
    data: 'audio call has been connected'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
}


function reject_video(){
  var button2 = document.getElementById('video_play1');
  button2.pause();
  event.preventDefault();
  session.signal({
    type: 'reject',
    data: 'video call has been rejected'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
}





function reject_audio(){
  var button2 = document.getElementById('audio_play22');
  button2.pause();
  event.preventDefault();
  session.signal({
    type: 'reject_audio',
    data: 'audio call has been rejected'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
}




function call_audio() {
  // publisher_audio();
  event.preventDefault();
  console.log('calling audio');
  session.signal({
    type: 'calling_audio',
    data: 'audio calling ......'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });
}




function session_destroy(){
  console.log('disconnected');
    session.signal({
    type: 'destroy',
    data: 'video call has been destroyed'
  }, function signalCallback(error) {
    if (error) {
      console.error('Error sending signal:', error.name, error.message);
    } else {
      msgTxt.value = '';
    }
  });

}

function hide_video(){
  publisher.publishVideo(false);
  console.log('hide');
}


function show_video(){
  publisher.publishVideo(true);
  console.log('show');

}
function mute_audio(){
console.log('mute');
  publisher.publishAudio(false);

}


function unmute_audio(){
  console.log('unmute');
    publisher.publishAudio(true);
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  console.log('token open frist');
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    initializeSession();
  }).catch(function catchErr(error) {
    console.error('There was an error fetching the session information', error.name, error.message);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
