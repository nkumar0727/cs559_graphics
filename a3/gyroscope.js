/*
      Author: Nikhil Kumar
       ID: 9073489388
       Course: CS 559 Computer Graphics
       Assignment: Assignment 2
*/

function setup() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");
  var slider1 = document.getElementById("slider1");
  slider1.value = Math.PI/4;

  var slider2 = document.getElementById("slider2");
  slider2.value = -1*Math.PI/2.25;

  var slider3 = document.getElementById("slider3");
  slider3.value = 0;

  var m4 = twgl.m4;

  // taken from cs559 example
  // link: https://jsbin.com/qiyeyiqoto/edit?html,js,output 
  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx, loc);
    context.moveTo(locTx[0], locTx[1]);
  }

  // taken from cs559 example
  // link: https://jsbin.com/qiyeyiqoto/edit?html,js,output 
  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.lineTo(locTx[0], locTx[1]);
  }

  // taken from cs559 example
  // link: https://jsbin.com/qiyeyiqoto/edit?html,js,output
  function drawAxes(Tx) {
    context.lineWidth = 3;
    context.beginPath(); context.strokeStyle="blue"; moveToTx(0,0,0,Tx);
    lineToTx(400,0,0,Tx); context.stroke(); context.closePath();

    context.beginPath(); context.strokeStyle="black"; moveToTx(0,0,0,Tx);
    lineToTx(0,400,0,Tx); context.stroke(); context.closePath();

    context.beginPath(); context.strokeStyle="red"; moveToTx(0,0,0,Tx);
    lineToTx(0,0,400,Tx); context.stroke(); context.closePath();
  }

  function drawRotor(Tx) {
    var rad = 100;
    context.lineWidth = 5;
    context.fillStyle = "yellow";
    context.strokeStyle = "black";
    // z is x, x is y
    // z = rcos(), x = rsin()
    // draw repeated circles to form a thick disk
    for(var offset = -10; offset <= 0; offset += 1) {
      moveToTx(0, offset, rad, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(rad * Math.sin(t), rad * Math.cos(t), offset, Tx);
      }
      context.closePath();
      context.stroke();
      context.fill();
    }
  }

  function drawSpindle_Ring(Tx) {
    var rad = 5;
    var radBig = 125;
    context.fillStyle = "blue";
    context.lineWidth = 2;

    // spindle
    for(var h = -1*radBig; h <= radBig; h+=10) {
      moveToTx(0, 0, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(rad * Math.sin(t), h, rad * Math.cos(t), Tx);
      }
      context.closePath();
      context.fill();
    }

    // spindle ring
    context.strokeStyle = "blue";
    for(var z = -10; z <= 10; z+=2) {
      moveToTx(0, 0, z, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(radBig * Math.sin(t), radBig * Math.cos(t), z, Tx);
      }
      context.closePath();
      context.stroke();
    }

    // connect spindle ring to gimbal
    context.fillStyle = "black";
    for(var x = radBig; x <= radBig+25; x++) {
      moveToTx(x, 0, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(x, rad * Math.sin(t), rad * Math.cos(t), Tx);
      }
      context.closePath();
      context.fill();
    }
    for(var x = -1*radBig; x >= -1*(radBig+25); x--) {
      moveToTx(x, 0, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(x, rad * Math.sin(t), rad * Math.cos(t), Tx);
      }
      context.closePath();
      context.fill();
    }
  }

  function drawGimbal(Tx) {
    var rad = 150;
    var lrad = 5;
    context.strokeStyle = "red";
    context.lineWidth = 4;
    for(var offset = -10; offset <= 0; offset += 1) {
      moveToTx(0, offset, rad, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(rad * Math.sin(t), rad * Math.cos(t), offset, Tx);
      }
      context.closePath();
      context.stroke();
    }

    // connections from frame to gimbal
    context.fillStyle = "black";
    for(var y = rad; y <= rad+25; y++) {
      moveToTx(0, y, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(lrad * Math.cos(t), y, lrad * Math.sin(t), Tx);
      }
      context.closePath();
      context.fill();
    }
    for(var y = -1*rad; y >= -1*(rad+25); y--) {
      moveToTx(0, y, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(lrad * Math.cos(t), y, lrad * Math.sin(t), Tx);
      }
      context.closePath();
      context.fill();
    }
  }

  function drawFrame(Tx) {
    var rad = 175;
    var lrad = 5; 
    context.lineWidth = 4;
    context.strokeStyle = "black";
    for(var z = -10; z <= 10; z += 2) {
      moveToTx(0, 0, z, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(rad * Math.sin(t), rad * Math.cos(t), z, Tx);
      }
      context.closePath();
      context.stroke();
    }

    // main rotation axes for frame 
    context.fillStyle = "black";
    for(var z = rad; z <= rad+75; z++) {
      moveToTx(0, z, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(lrad * Math.sin(t), z, lrad * Math.cos(t), Tx);
      }
      context.closePath();
      context.fill();
    }
    for(var z = -1*rad; z >= -1*(rad+75); z--) {
      moveToTx(0, z, 0, Tx);
      context.beginPath();
      for(var t = 0; t < 2 * Math.PI; t += 0.01) {
        lineToTx(lrad * Math.sin(t), z, lrad * Math.cos(t), Tx);
      }
      context.closePath();
      context.fill();
    }
  }

  // basic (x,y,z)
  var xAxis = [1,0,0];
  var yAxis = [0,1,0];
  var zAxis = [0,0,1];

  // Axes
  var sAxis = [0,1,0]; 
  var gAxis = [1,0,0]; 
  var fAxis = [0,0,1];

  // Angles
  var bAngle = 0;
  var theta = 0;
  var bInc = 0.001;

  function draw() {
    canvas.width = canvas.width;
    var cosb = Math.cos(bAngle);
    var sinb = Math.sin(bAngle);

    if(bAngle >= Math.PI / 10)
      bInc = -0.002;
    else if(bAngle <= 0)
      bInc = 0.002;

    gAxis = [cosb*gAxis[0] + sinb*gAxis[2],
             gAxis[1],
             -1*sinb*gAxis[0] + cosb*gAxis[2]];

    sAxis = [cosb*sAxis[0] - sinb*sAxis[1],
             sinb*sAxis[0] + cosb*sAxis[1],
             sAxis[2]];

    fAxis = [fAxis[0],
             cosb*fAxis[1] - sinb*fAxis[2],
             sinb*fAxis[1] + cosb*fAxis[2]];

    // base transform for everything to get in viewing window
    // taken from cs559 example
    // link: https://jsbin.com/qiyeyiqoto/edit?html,js,output 
    var eye = [200 * Math.cos(slider1.value), 
      400 * Math.cos(slider2.value), 200 * Math.sin(slider1.value)];
    var target = [0,0,0];
    var up = [0,1,0];
    var Tcamera = m4.multiply(
      m4.inverse(m4.lookAt(eye, target, up)), 
      m4.multiply(
        m4.scaling([1,-1,1]), 
        m4.translation([400, 400, 0])));

    var Trotor = m4.multiply(m4.axisRotation(xAxis, Math.PI / -2), Tcamera);
    var Tspindle = m4.copy(Tcamera); 
    var Tgimbal = m4.copy(Trotor);
    var Tframe = m4.multiply(m4.axisRotation(yAxis, Math.PI / 2), Tcamera);

    var Trot_spindle = m4.multiply(m4.axisRotation(sAxis, bAngle), m4.multiply(m4.axisRotation(yAxis, theta), Tspindle));
    var Trot_gimbal = m4.multiply(m4.axisRotation(gAxis, bAngle), m4.multiply(m4.axisRotation(zAxis, theta), Tgimbal));
    var Trot_frame = m4.multiply(m4.axisRotation(fAxis, bAngle), m4.multiply(m4.axisRotation(yAxis, theta), Tframe));

    drawRotor(m4.multiply(m4.axisRotation(sAxis, bAngle), m4.multiply(m4.axisRotation(zAxis, theta), Trotor)));
    drawAxes(Tcamera);
    drawSpindle_Ring(Trot_spindle);
    drawGimbal(Trot_gimbal);
    drawFrame(Trot_frame);

    bAngle += bInc;
    theta += slider3.value / 10;
    window.requestAnimationFrame(draw);
  }

  window.requestAnimationFrame(draw);
}
window.onload = setup;
