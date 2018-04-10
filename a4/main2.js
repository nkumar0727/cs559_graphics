
/*
Author: Nikhil Kumar
ID: 9073489388
Course: CS 559 Computer Graphics
Assignment: Assignment 4
*/

function setup() {
  /*
  * Normal canvas setup
  */
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  var m4 = twgl.m4;
  var v3 = twgl.v3;

  var zAngle = 4;
  var jump = 2;
  var incj = 1.3;
  var slide = 3;
  var incs = 1.3;
  var slidex = 49;
  var incsx = -1;

  // axes
  var origin = [0,0,0];
  var xAxis = [1,0,0];
  var yAxis = [0,1,0];
  var zAxis = [0,0,1];

  /*
   * Basic drawing functions
   */

  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output
  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx, loc);
    ctx.moveTo(locTx[0], locTx[1]);
  }

  function moveToTxAlt(loc, Tx) {
    var locTx = m4.transformPoint(Tx, loc);
    ctx.moveTo(locTx[0], locTx[1]);
  }

  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output
  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    ctx.lineTo(locTx[0], locTx[1]);
  }

  function lineToTxAlt(loc, Tx) {
    var locTx = m4.transformPoint(Tx, loc);
    ctx.lineTo(locTx[0], locTx[1]);
  }

  /*
  * Polygon drawing (assumes points are 3-tuples)
  *   -v = vec3 --> triangle
  *   -v = vec4 --> rectangle
  *   -...
  */
  function Polygon(Tx, color, v) {
    this.color = color;
    this.v = v;
    this.vCount = v.length;
    this.Tx = Tx;

    // measure the average z-distance for painter's
    this.dist = 0;
    var tPoint = [];
    for(var j = 0; j < v.length; ++j) {
      m4.transformPoint(Tx, v[j], tPoint);
      this.dist += tPoint[2];
    }
    this.dist /= v.length;
  }

  Polygon.prototype.draw = function() {
    ctx.fillStyle = this.color;
    ctx.strokeStyle = "black";
    moveToTxAlt(this.v[this.vCount - 1], this.Tx); ctx.beginPath();
    for(var i = 0; i < this.vCount; ++i) {
      lineToTxAlt(this.v[i], this.Tx);
    }
    ctx.closePath(); ctx.stroke(); ctx.fill();
  };


  // TODO: for head, draw an octogon
  function drawRobot(T, color, color2, color3, color4) {
    var w = 20; var h = 90; var t = h + 90; var d = 20; var e = t + 20;
    var L = d*(1 + Math.sqrt(2)); var s = 30; var f = e + s; var c = f + 20;
    // arm vars
    var a = h + 40;
    // one leg
    var polyList = [
      new Polygon(T, color, [[-1*w/2,0,0], [-1*w,h,w/2], [0,h,w/2]]),
      new Polygon(T, color, [[-1*w/2,0,0], [-1*w,h,-1*w/2], [0,h,-1*w/2]]),
      new Polygon(T, color, [[-1*w/2,0,0], [-1*w,h,-1*w/2], [-1*w,h,w/2]]),
      new Polygon(T, color, [[-1*w/2,0,0], [0,h,-1*w/2], [0,h,w/2]]),
      // other leg
      new Polygon(T, color, [[w/2,0,0], [0,h,w/2], [w,h,w/2]]),
      new Polygon(T, color, [[w/2,0,0], [0,h,-1*w/2], [w,h,-1*w/2]]),
      new Polygon(T, color, [[w/2,0,0], [0,h,-1*w/2], [0,h,w/2]]),
      new Polygon(T, color, [[w/2,0,0], [w,h,-1*w/2], [w,h,w/2]]),
      // torso
      new Polygon(T, color2, [[0,t,0], [w,h,-1*w/2], [w,h,w/2]]),
      new Polygon(T, color2, [[0,t,0], [w,h,-1*w/2], [-1*w,h,-1*w/2]]),
      new Polygon(T, color2, [[0,t,0], [-1*w,h,-1*w/2], [-1*w,h,w/2]]),
      new Polygon(T, color2, [[0,t,0], [-1*w,h,w/2], [w,h,w/2]]),
      // head base
      new Polygon(T, color3, [[0,t,0], [-1*d/2,e,-1*L/2], [-1*L/2,e,-1*d/2]]),
      new Polygon(T, color3, [[0,t,0], [-1*L/2,e,-1*d/2], [-1*L/2,e,d/2]]),
      new Polygon(T, color3, [[0,t,0], [-1*L/2,e,d/2], [-1*d/2,e,L/2]]),
      new Polygon(T, color3, [[0,t,0], [-1*d/2,e,L/2], [d/2,e,L/2]]),
      new Polygon(T, color3, [[0,t,0], [d/2,e,L/2], [L/2,e,d/2]]),
      new Polygon(T, color3, [[0,t,0], [L/2,e,d/2], [L/2,e,-1*d/2]]),
      new Polygon(T, color3, [[0,t,0], [L/2,e,-1*d/2], [d/2,e,-1*L/2]]),
      new Polygon(T, color3, [[0,t,0], [d/2,e,-1*L/2], [-1*d/2,e,-1*L/2]]),
      // head main
      new Polygon(T, color3, [[-1*d/2,e,-1*L/2], [-1*L/2,e,-1*d/2], [-1*L/2,f,-1*d/2], [-1*d/2,f,-1*L/2]]),
      new Polygon(T, color3, [[-1*L/2,e,-1*d/2], [-1*L/2,e,d/2], [-1*L/2,f,d/2], [-1*L/2,f,-1*d/2]]),
      new Polygon(T, color3, [[-1*L/2,e,d/2], [-1*d/2,e,L/2], [-1*d/2,f,L/2], [-1*L/2,f,d/2]]),
      new Polygon(T, color3, [[-1*d/2,e,L/2], [d/2,e,L/2], [d/2,f,L/2], [-1*d/2,f,L/2]]),
      new Polygon(T, color3, [[d/2,e,L/2], [L/2,e,d/2], [L/2,f,d/2], [d/2,f,L/2]]),
      new Polygon(T, color3, [[L/2,e,d/2], [L/2,e,-1*d/2], [L/2,f,-1*d/2], [L/2,f,d/2]]),
      new Polygon(T, color3, [[L/2,e,-1*d/2], [d/2,e,-1*L/2], [d/2,f,-1*L/2], [L/2,f,-1*d/2]]),
      new Polygon(T, color3, [[d/2,e,-1*L/2], [-1*d/2,e,-1*L/2], [-1*d/2,f,-1*L/2], [d/2,f,-1*L/2]]),
      //*/
      // head top
      new Polygon(T, color3, [[0,c,0], [-1*d/2,f,-1*L/2], [-1*L/2,f,-1*d/2]]),
      new Polygon(T, color3, [[0,c,0], [-1*L/2,f,-1*d/2], [-1*L/2,f,d/2]]),
      new Polygon(T, color3, [[0,c,0], [-1*L/2,f,d/2], [-1*d/2,f,L/2]]),
      new Polygon(T, color3, [[0,c,0], [-1*d/2,f,L/2], [d/2,f,L/2]]),
      new Polygon(T, color3, [[0,c,0], [d/2,f,L/2], [L/2,f,d/2]]),
      new Polygon(T, color3, [[0,c,0], [L/2,f,d/2], [L/2,f,-1*d/2]]),
      new Polygon(T, color3, [[0,c,0], [L/2,f,-1*d/2], [d/2,f,-1*L/2]]),
      new Polygon(T, color3, [[0,c,0], [d/2,f,-1*L/2], [-1*d/2,f,-1*L/2]]),
      // one arm
      new Polygon(T, color4, [[(w/2)+2,a+20,0], [w+15,h,w/2], [w+15,h,-1*w/2]]),
      new Polygon(T, color4, [[(w/2)+2,a+20,0], [w+15,h,w/2], [w,h,w/2]]),
      new Polygon(T, color4, [[(w/2)+2,a+20,0], [w+15,h,-1*w/2], [w,h,-1*w/2]]),
      new Polygon(T, color4, [[(w/2)+2,a+20,0], [w,h,-1*w/2], [w,h,w/2]]),
      // other arm
      new Polygon(T, color4, [[(-1*w/2)-2,a+20,0], [-1*(w+15),h,w/2], [-1*(w+15),h,-1*w/2]]),
      new Polygon(T, color4, [[(-1*w/2)-2,a+20,0], [-1*(w+15),h,w/2], [-1*w,h,w/2]]),
      new Polygon(T, color4, [[(-1*w/2)-2,a+20,0], [-1*(w+15),h,-1*w/2], [-1*w,h,-1*w/2]]),
      new Polygon(T, color4, [[(-1*w/2)-2,a+20,0], [-1*w,h,-1*w/2], [-1*w,h,w/2]])
    ];

    // draw robot according to painter's algorithm
    polyList.sort(function(a, b) {
      if(a.dist >= b.dist) return 1;
      else return -1;
    });
    for(var i = 0; i < polyList.length; ++i) {
        polyList[i].draw();
    }
  }


  /*
  * Core drawing
  */
  function drawWorld() {
    // setup transformation stack
    canvas.width = canvas.width;
    var len = 300;
    stk_top = 0;
    Tw_stack = [];
    Tw_stack.push(m4.identity()); // [ Id ]

    /*
    * Setup fixed world camera and world axis
    */
    var eye = [800 * Math.cos(zAngle), 800 * Math.sin(Math.PI/10), 800 * Math.sin(zAngle)];

    // [Tviewpt -> Id]
    Tw_stack.push(
      m4.multiply(
        m4.multiply(
          m4.scaling([600,-500,600]),
          m4.translation([600,500,0])
        ),
        Tw_stack[stk_top++]
      )
    );

    // [Twproj -> Tviewpt -> Id]
    Tw_stack.push(
      m4.multiply(
        // m4.ortho(-100,100,-100,100,1,100),
        // m4.identity(),
        m4.perspective(Math.PI/2, 1, 5, 400),
        Tw_stack[stk_top++]
      )
    );

    // [Twcam -> Twproj -> Tviewpt -> Id]
    Tw_stack.push(
      m4.multiply(
          m4.inverse(m4.lookAt(eye, origin, yAxis)),
          Tw_stack[stk_top++]
      )
    );

    Tw_stack.push(
      m4.multiply(
        m4.translation([2*slidex,jump,-5*slide]),
        m4.multiply(
          m4.translation([len/2,0,len/2]),
          Tw_stack[stk_top++]
        )
      )
    );

    drawRobot(Tw_stack[stk_top], "yellow", "red", "orange", "blue");

    // movement update
    if(jump > 70) {
      incj = -1.8;
      jump = 69;
    }
    else if(jump < 0) {
      incj = 2.3;
      jump = 1;
    }

    if(slide > 80) {
      incs = -1.9;
      slide = 79;
    }
    else if(slide < -80) {
      incs = 2.2;
      slide = -79;
    }

    if(slidex > 80) {
      incsx = -1.9;
      slidex = 79;
    }
    else if(slidex < -80) {
      incsx = 2.4;
      slidex = -79;
    }

    zAngle += 0.01;
    jump += incj;
    slide += incs;
    slidex += incsx;

    window.requestAnimationFrame(drawWorld)
  }
  drawWorld();
  window.requestAnimationFrame(drawWorld)
}
window.onload = setup;
