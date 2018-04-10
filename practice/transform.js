
function setup() { "use strict";
    var OSTART = 50;

    var cvs = document.getElementById("cvs");
    var xTrans = document.getElementById("xTrans");
    var yTrans = document.getElementById("yTrans");
    var oTrans = document.getElementById("oTrans");
    xTrans.value = yTrans.value = 0;
    oTrans.value = OSTART;

    function draw() {
      var ctx = cvs.getContext("2d"); // get context @ this time
      cvs.width = cvs.width; // clear current context; start fresh

      // current slider values so that we can update the image
      var dx = xTrans.value;
      var dy = yTrans.value;
      var theta = (oTrans.value - OSTART)*Math.PI*0.01;

      function DrawL(color) {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.moveTo(OSTART, 25);
        ctx.lineTo(150, 25);
        ctx.lineTo(150, 75);
        ctx.lineTo(100, 75);
        ctx.lineTo(100, 175);
        ctx.lineTo(50, 175);
        ctx.fill();
      }

      function DrawAxes(color) {
        ctx.strokeStyle = color;
        ctx.beginPath();
        // axes
        ctx.moveTo(120, 0);
        ctx.lineTo(0,0);
        ctx.lineTo(0, 120);
        // arrows
        ctx.moveTo(110,5);
        ctx.lineTo(120,0);
        ctx.lineTo(110,-5);
        ctx.moveTo(5,110);
        ctx.lineTo(0,120);
        ctx.lineTo(-5,110);
        // X-label
    ctx.moveTo(130,0);ctx.lineTo(140,10);
    ctx.moveTo(130,10);ctx.lineTo(140,0);
    // Y-label
    ctx.moveTo(0,130);ctx.lineTo(5,135);ctx.lineTo(10,130);
    ctx.moveTo(5,135);ctx.lineTo(5,142);

      ctx.stroke();
      }

      DrawAxes("black");
      ctx.save();
      ctx.rotate(theta);
      DrawAxes("red");
      ctx.translate(dx, dy);
      DrawAxes("green");
      DrawL("green");
      ctx.restore();
    }

    xTrans.addEventListener("input", draw);
    yTrans.addEventListener("input", draw);
    oTrans.addEventListener("input", draw);
    draw();
}

window.onload = setup;
