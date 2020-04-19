let socket = io.connect("https://watch-together-now.herokuapp.com");

// Extracted buttons
let buttons = document.getElementsByTagName("button");
let playButton = buttons[0];
let pauseButton = buttons[1];

// slider
let slider = document.getElementById("slider");

//videoIdInput
let videoId = document.getElementById("videoId");

// pause and play event listener added
playButton.addEventListener("click", playVideo);
pauseButton.addEventListener("click", pauseVideo);

let player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player("player", {
    height: "500px",
    width: "100%",
    videoId: "M7lc1UVf-VE",
    playerVars: {
      autoplay: 0,
      rel: 0,
      modestbranding: 1,
      controls: 0,
      disablekb: 1,
      showInfo: 0,
    },
  });
}

// play event added
function playVideo() {
  var newID = new String(videoId.value);
  var oldID = new String(player.getVideoData()["video_id"]);
  if (
    newID.valueOf() != undefined &&
    newID.valueOf() != "" &&
    newID.valueOf() !== oldID.valueOf()
  ) {
    player.loadVideoById(newID);
  }
  socket.emit("play");
  player.playVideo();
  setInterval(() => {
    let fraction = (player.getCurrentTime() / player.getDuration()) * 100;
    slider.value = fraction;
    socket.emit("slider", slider.value);
  }, 200);
}

// pause event handled
function pauseVideo() {
  socket.emit("pause");
  player.pauseVideo();
}

// seeker handled
function changeTime(e) {
  let goTo = player.getDuration() * (e.value / 100);
  console.log(goTo);
  player.seekTo(goTo, true);
  e.value = goTo;
  socket.emit("update", goTo);
}

// socket events handled

socket.on("update", (data) => {
  console.log("Recieved data", data);
  slider.value = data;
  player.seekTo(data, true);
});

socket.on("play", () => {
  player.playVideo();
});

socket.on("pause", () => {
  player.pauseVideo();
});

socket.on("slider", (data) => {
  slider.value = data;
});
