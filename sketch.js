//Hand-Synthesiser, May 2024. 

//For HandTracking
let video;
let handpose;
let predictions = [];
let thumbTip = [];
let indexTip = [];
let middleTip = [];
let ringTip = [];
let pinkyTip = [];

//For oscillator
let osc, playing, freq, amp;
let indexFreq, middleFrequency, ringFrequency, pinkyFrequency;

let freqPlaying = 0; 

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", gotPredictions);

  //Initialise Oscillator
  osc = new p5.Oscillator("triangle");
}

//To tell whether model has loaded or not
function modelReady() {
  text("Model loaded", 50, 50);
}

function gotPredictions(results) {
  predictions = results;
}

function draw() {
  background(255);
  // Flip the video horizontally

  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  handDraw();
  pop();

  scale(1, 1);
  distCalc();
}

function handDraw() {
  if (predictions.length > 0) {
    let hand = predictions[0].landmarks; // Extracting landmarks from the first prediction

    // Accessing specific landmark points
    thumbTip = hand[4]; // Thumb tip
    indexTip = hand[8]; // Index finger tip
    middleTip = hand[12]; // Middle finger tip
    ringTip = hand[16]; // Ring finger tip
    pinkyTip = hand[20]; // Pinky finger tip

    //debug-view to have handTog
    strokeWeight(7);
    noFill();
    stroke("red");
    point(thumbTip[0], thumbTip[1]);
    point(indexTip[0], indexTip[1]);
    point(middleTip[0], middleTip[1]);
    point(ringTip[0], ringTip[1]);
    point(pinkyTip[0], pinkyTip[1]);
  }
}

function distCalc() {
  var dIndex = dist(thumbTip[0], thumbTip[1], indexTip[0], indexTip[1]);
  var dMid = dist(thumbTip[0], thumbTip[1], middleTip[0], middleTip[1]);
  var dRing = dist(thumbTip[0], thumbTip[1], ringTip[0], ringTip[1]);
  var dPinky = dist(thumbTip[0], thumbTip[1], pinkyTip[0], pinkyTip[1]);

  textAlign (LEFT); 
  textSize(10);
  fill(0);
  noStroke();
  text("thumb-index: " + int(dIndex), 50, 30 + 15);
  text("thumb-middle: " + int(dMid), 50, 30 + 30);
  text("thumb-ring: " + int(dRing), 50, 30 + 45);
  text("thumb-pinky: " + int(dPinky), 50, 30 + 60);

  textAlign(RIGHT); 

  text ("frequency playing: "+ freqPlaying, width-50, 30+15); 

  perform(
    dIndex,
    dMid,
    dRing,
    dPinky,
    thumbTip[0],
    indexTip[1],
    middleTip[1],
    ringTip[1],
    pinkyTip[1]
  );
}

function perform(
  dIndex,
  dMid,
  dRing,
  dPinky,
  thumbTipX,
  indexTipY,
  middleTipY,
  ringTipY,
  pinkyTipY
) {
  //Changing amplitude based on horizontal position of thumb on screen.
  amp = constrain(map(thumbTipX, width, 0, 0, 1), 0, 1);

  //Mapping frequencies to position of finger on screen. 
  //Used music references from Tom Cortina's Class: 15-104 Introduction to Computing for Creative Practice (24, More Sound). 
  indexFreq = map(indexTipY, height, 0, 27.5, 880); //A0-A5
  middleFrequency = map(middleTipY, height, 0, 30.868, 987.77); //B0-B5
  ringFrequency = map(ringTipY, height, 0, 32.703, 1046.5); //C1-C6
  pinkyFrequency = map(pinkyTipY, height, 0, 43.654, 1318.5); //E1-E6

  //Consider boilerplate for playing. True means amp is set based on the mapping and oscillator starts, else oscillator amp is 0.
  if (playing) {
    osc.amp(amp, 0.1);
    osc.start();
    playing=false;
  } else {
    osc.amp(0, 0.1);
  }

  //Main playing mapping – each bucket takes a distance threshold and plays a certain frequency.
  if ((dIndex <= 80) & (dIndex != 0)) {
    //for index
    osc.freq(indexFreq, 0.1);
    playing = true;
    freqPlaying = indexFreq; 
  } else if ((dMid <= 80) & (dMid != 0)) {
    //for middle
    osc.freq(middleFrequency, 0.1);
    playing = true;
    freqPlaying = middleFrequency; 
  } else if ((dRing <= 80) & (dRing != 0)) {
    //for ring
    osc.freq(ringFrequency, 0.1);
    playing = true;
    freqPlaying = ringFrequency;
  } else if ((dPinky <= 80) & (dRing != 0)) {
    //for pinky
    osc.freq(pinkyFrequency, 0.1);
    playing = true;
    freqPlaying = pinkyFrequency;
  }else if (dPinky <= 80 & dMid<=80 & dRing<=80 & dIndex<=80){ //Fingers are clumped or off the screen, so play nothing.
    playing = false;
  } else {
    freqPlaying = 0; 
    playing = false;
  }
}

/*
function drawKeypoints() {
  for (let i = 0; i < predictions.length; i++) {
    let prediction = predictions[i];
    for (let j = 0; j < prediction.landmarks.length; j++) {
      let point = prediction.landmarks[j];
      fill(255, 0, 0);
      noStroke();
      ellipse(point[0], point[1], 10, 10);
    }
  }
}
*/

/*
// Assuming predictions array is already populated with hand tracking data

if (predictions.length > 0) {
  let hand = predictions[0].landmarks; // Extracting landmarks from the first prediction

  // Accessing specific landmark points
  let thumbTip = hand[4]; // Thumb tip
  let indexTip = hand[8]; // Index finger tip
  let middleTip = hand[12]; // Middle finger tip
  let ringTip = hand[16]; // Ring finger tip
  let pinkyTip = hand[20]; // Pinky finger tip

  // Each landmark is an array [x, y, z] representing its 3D position
  // Access individual coordinates like this:
  let thumbTipX = thumbTip[0]; // X-coordinate of thumb tip
  let thumbTipY = thumbTip[1]; // Y-coordinate of thumb tip
  let thumbTipZ = thumbTip[2]; // Z-coordinate of thumb tip
}

*/
