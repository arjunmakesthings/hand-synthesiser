# hand-synthesiser
Using my previous study on hand landmarks, I made a synthesiser that operates via the hand. 

First, the program calculates the distance between each finger on a single hand and returns this distances. 

``` js
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
```

Then, a function called 'perform' maps distances to frequencies based on the 'note' assigned to each finger (index is A, middle is B ... and so on). Furthermore, horizontal position of the thumb determines the amplitude whereas vertical position of the fingers determine the pitch (high to low). 

``` js
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
```
