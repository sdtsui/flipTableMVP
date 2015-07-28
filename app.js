console.log(document.getElementById('flipStage').innerText === 'None');
var pDor = {
    alpha: null,
    gamma: null,
    beta: null
};

var dor = {
    alpha: null,
    gamma: null,
    beta: null
};

setInterval(function() {
    pDor = {
        alpha: dor.alpha,
        gamma: dor.gamma,
        beta: dor.beta
    }
    updatePGamma(pDor.gamma);
}, 90);

// var flipStage = {
//   0:,
//   1:,
//   2:,
//   3:

// }

if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function(event) {

        // alpha: rotation around z-axis
        // gamma: left to right
        // beta: front back motion
        dor = {
            alpha: event.alpha,
            gamma: event.gamma,
            beta: event.beta
        };
        socket.emit('deviceMotion' , dor);

        var diff = Math.abs(dor.gamma - pDor.gamma);
        updateDiff(diff);
        
        if(Math.abs(diff) > .3) {
          processStage(getStageName(), event.gamma);
        } else {
          // processStage(getStageName(), absGamma);
          // updateStage("None");
          indicateProcessing('blue');
        }

        // if (getStageName() === "4"){
        //   addFlipTable();
        // }
        broadcastMovement(dor);
    }, true);
}

function indicateProcessing(color){
  var diffEl = document.getElementById('diff');
  diffEl.style.backgroundColor = color;
  setTimeout(function(){
    diffEl.style.backgroundColor = "white";
  },500);
}

function processStage(currentStage, currentGamma) {
  console.log('Inputs: ', currentStage, currentGamma);
  indicateProcessing('red');
  document.getElementById('processedGamma').innerText = currentGamma || "NaN Received";
  if (currentStage === 'None'){
    indicateProcessing('green');
    if (currentGamma > 0 && currentGamma < 25) {
      updateStage('0');
    } 
  } else if (currentStage === '0') {
      if (currentGamma > 25 && currentGamma < 75) {
        updateStage('1');
      } 
  } else if (currentStage === '1') {
      if (currentGamma > 75 && currentGamma < 91) {
        updateStage('2');
      } else if (currentGamma < 25) {
      updateStage('None');
      }
  } else if (currentStage === '2') {
    if (currentGamma > 25 && currentGamma < 75) {
      updateStage('3');
    }
  } else if (currentStage === '3') {
    if (currentGamma > 0 && currentGamma < 25) {
      updateStage('4');//unnecessary
      addFlipTable(); 
    }
  }
}


function addFlipTable() {
  var flipEl = document.getElementById('flip');
  flipEl.innerText = '(╯°□°)╯︵ ┻━┻';
  setTimeout(function(){
    flipEl.innerText = '';
  }, 3000);
  updateStage('None');
}

function updatePGamma(val) {
  var diffEl = document.getElementById('pDor.gamma');
  diffEl.innerText = Math.floor(val);

}

function updateDiff(diff) {
  var diffEl = document.getElementById('diff');
  diffEl.innerText = diff;
}

function updateStage(stageName){
    var flipStage = document.getElementById('flipStage');
    flipStage.innerText = stageName;
}

function getStageName(){
    return document.getElementById('flipStage').innerText;
}

function broadcastMovement(d) {
        var alpha = document.getElementById('alpha');
        var gamma = document.getElementById('gamma');
        var beta = document.getElementById('beta');

        alpha.innerText = Math.floor(d.alpha);
        gamma.innerText = Math.floor(d.gamma);
        beta.innerText = Math.floor(d.beta);
        
};

/**
 * 2nd Listener
 */

var last10GammaReadings = [];
var last10Averages = [];
var lastMax = 0;
var c = document.getElementById("myCanvas");
function deviceOrientationListener(e) {
  var ctx = c.getContext("2d");

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#FF7777";
  ctx.font = "14px Verdana";
  ctx.fillText("Alpha: " + Math.round(e.alpha), 10, 20);
  ctx.beginPath();
  ctx.moveTo(180, 75);
  ctx.lineTo(210, 75);
  ctx.arc(180, 75, 60, 0, e.alpha * Math.PI / 180);
  ctx.fill();

  ctx.fillStyle = "#FF6600";
  ctx.fillText("Beta: " + Math.round(e.beta), 10, 140);
  ctx.beginPath();
  ctx.fillRect(180, 150, e.beta, 90);

  ctx.fillStyle = "#FF0000";
  ctx.fillText("Gamma: " + Math.round(e.gamma), 10, 270);
  ctx.beginPath();
  ctx.fillRect(90, 340, 180, e.gamma);

  last10GammaReadings.push(Math.floor(e.gamma));
  if(last10GammaReadings.length >10){
    last10GammaReadings.shift();
  }
  ctx.clearRect(10,390,100,100);
  ctx.fillText("last10GammaReadings: " + last10GammaReadings.toString(), 10, 420);
  // ctx.clearRect(10,390,750,100);

  var lastAverage = last10GammaReadings.reduce(function(sum, nextVal){
    return sum+nextVal},0)/last10GammaReadings.length;
  ctx.clearRect(10,480,750,100);
  ctx.fillText("averageOfLast10: " + lastAverage.toString(), 10, 500);
  // ctx.clearRect(10,480,750,100);
  // 
  last10Averages.push(lastAverage);
  if(last10Averages.length >10){
    last10Averages.shift();
  }


  ctx.clearRect(10,565,750,100);
  ctx.fillText("last10Averages: " + last10Averages.toString(), 10, 575);
  // ctx.clearRect(10,565,750,100);

  //begins at any number over 0:
  //abs sum of last 10 averages gets of 80
  //then ENDS at any number over -10
  // if (e.gamma > lastMax) {lastMax = e.gamma}

  // if (firstReading > 0) {}
}

if (window.DeviceOrientationEvent) {
  console.log("deviceOrientationSupported");
  window.addEventListener("deviceorientation", deviceOrientationListener);
} else {
  alert("Sorry, your browser doesn't support Device Orientation");
}
