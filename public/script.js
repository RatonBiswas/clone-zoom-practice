const socket = io("/");
const videoGrid = document.getElementById("video-grid");

const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: "8000",
});

let myVideoStream;
navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      const video = document.createElement("video");
    //   console.log('new video')
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      connetToNewUser(userId, stream);
    });

    let text = $('input')
    $('html').keydown((e)=>{
        if(e.which == 13 && text.val().length !== 0){
            socket.emit('message', text.val());
            // console.log(text.val());
            text.val('');
        }
    })
    socket.on('createMessage',message => {
        $('ul').append(`<li class="message"><b>user</b><br/>${message}</li>`)
        scrollToBottom();
    })
  });
peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

// socket.emit('join-room', ROOM_ID);

const connetToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
//   console.log(userId);
};

const addVideoStream = (video, stream) => {
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
    let d = $('.main__chat__window');
    d.scrollTop(d.prop("scrollHeight"))
}

//** Mute and unmute our video 
const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }else {
        setMuteButton();
        myvideoStream.getAudioTracks()[0].enabled = true;
    }
}

const setMuteButton = () => {
    const html = `<i class="fas fa-microphone"></i><span>Mute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}
const setUnmuteButton = () => {
    const html = `<i class="unmute fas fa-microphone-slash"></i><span>Unmute</span>`
    document.querySelector('.main__mute_button').innerHTML = html;
}


