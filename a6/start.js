

/*
    Author: Nikhil Kumar
     ID: 9073489388
     Course: CS 559 Computer Graphics
     Assignment: Assignment 6
*/

function start() {
  "use strict";

  // ---------------------- BOILERPLATE CODE START ---------------------------
  var canvas = document.getElementById("mycanvas");
	var gl = canvas.getContext("webgl");
  var m4 = twgl.m4;

  // Sliders control viewing perspective
  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;

  var vertexSource = document.getElementById("vs").text;
  var fragmentSource = document.getElementById("fs").text;

  // compile the vertex shader
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader,vertexSource);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(vertexShader));
          return null;
      }

  // compile the fragment shader
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader,fragmentSource);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
          alert(gl.getShaderInfoLog(fragmentShader));
          return null;
      }

  // create shader program
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }
  gl.useProgram(shaderProgram);

  // with the vertex shader, we need to pass it positions
  // as an attribute - so set up that communication
  shaderProgram.vertexPosAttr = gl.getAttribLocation(shaderProgram, "pos");
  gl.enableVertexAttribArray(shaderProgram.vertexPosAttr);

  shaderProgram.vertexColAttr = gl.getAttribLocation(shaderProgram, "inColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColAttr);

  shaderProgram.Mmatrix = gl.getUniformLocation(shaderProgram, "modelMatrix");
  shaderProgram.Pmatrix = gl.getUniformLocation(shaderProgram, "projectionMatrix");
  shaderProgram.Cmatrix = gl.getUniformLocation(shaderProgram, "cameraMatrix");
  shaderProgram.Vmatrix = gl.getUniformLocation(shaderProgram, "viewMatrix");
  shaderProgram.Time = gl.getUniformLocation(shaderProgram, "time");


  // ---------------------- BOILERPLATE CODE END ---------------------------











    // ---------------------- SCENE DATA START ---------------------------
  var w = 20; var h = 90; var t = h + 90; var d = 20; var e = t + 20;
  var L = d * (1 + Math.sqrt(2)); var s = 30; var f = e + s; var c = f + 20;
  var a = h + 40; var ctw = 20; var cft = 15; var ct = 2;

  var vertexPosList = [
    new Float32Array([  // Left Leg
      -1*w/2,0,0,   -1*w,h,w/2,      0,h,w/2,
      -1*w/2,0,0,   -1*w,h,-1*w/2,   0,h,-1*w/2,
      -1*w/2,0,0,   -1*w,h,-1*w/2,   -1*w,h,w/2,
      -1*w/2,0,0,   0,h,-1*w/2,      0,h,w/2
    ]),
    new Float32Array([  // Right Leg
      w/2,0,0,   0,h,w/2,      w,h,w/2,
      w/2,0,0,   0,h,-1*w/2,   w,h,-1*w/2,
      w/2,0,0,   0,h,-1*w/2,   0,h,w/2,
      w/2,0,0,   w,h,-1*w/2,   w,h,w/2
    ]),
    new Float32Array([  // Torso
      0,t,0,   w,h,-1*w/2,      w,h,w/2,
      0,t,0,   w,h,-1*w/2,      -1*w,h,-1*w/2,
      0,t,0,   -1*w,h,-1*w/2,   -1*w,h,w/2,
      0,t,0,   -1*w,h,w/2,      w,h,w/2
    ]),
    new Float32Array([  // Head Base
      0,t,0,   -1*d/2,e,-1*L/2,   -1*L/2,e,-1*d/2,
      0,t,0,   -1*L/2,e,-1*d/2,   -1*L/2,e,d/2,
      0,t,0,   -1*L/2,e,d/2,      -1*d/2,e,L/2,
      0,t,0,   -1*d/2,e,L/2,      d/2,e,L/2,
      0,t,0,   d/2,e,L/2,         L/2,e,d/2,
      0,t,0,   L/2,e,d/2,         L/2,e,-1*d/2,
      0,t,0,   L/2,e,-1*d/2,      d/2,e,-1*L/2,
      0,t,0,   d/2,e,-1*L/2,      -1*d/2,e,-1*L/2
    ]),
    new Float32Array([  // Head Main    [0 1 2 3] => [3 2 1], [3, 1, 0]
      -1*d/2,e,-1*L/2,   -1*L/2,e,-1*d/2,   -1*L/2,f,-1*d/2,
      -1*d/2,e,-1*L/2,   -1*L/2,f,-1*d/2,   -1*d/2,f,-1*L/2,
      -1*L/2,e,-1*d/2,   -1*L/2,e,d/2,      -1*L/2,f,d/2,
      -1*L/2,e,-1*d/2,   -1*L/2,f,d/2,      -1*L/2,f,-1*d/2,
      -1*L/2,e,d/2,      -1*d/2,e,L/2,      -1*d/2,f,L/2,
      -1*L/2,e,d/2,      -1*d/2,f,L/2,      -1*L/2,f,d/2,
      -1*d/2,e,L/2,      d/2,e,L/2,         d/2,f,L/2,
      -1*d/2,e,L/2,      d/2,f,L/2,         -1*d/2,f,L/2,
      d/2,e,L/2,         L/2,e,d/2,         L/2,f,d/2,
      d/2,e,L/2,         L/2,f,d/2,         d/2,f,L/2,
      L/2,e,d/2,         L/2,e,-1*d/2,      L/2,f,-1*d/2,
      L/2,e,d/2,         L/2,f,-1*d/2,      L/2,f,d/2,
      L/2,e,-1*d/2,      d/2,e,-1*L/2,      d/2,f,-1*L/2,
      L/2,e,-1*d/2,      d/2,f,-1*L/2,      L/2,f,-1*d/2,
      d/2,e,-1*L/2,      -1*d/2,e,-1*L/2,   -1*d/2,f,-1*L/2,
      d/2,e,-1*L/2,      -1*d/2,f,-1*L/2,   d/2,f,-1*L/2
    ]),
    new Float32Array([  // Head Top
      0,c,0,   -1*d/2,f,-1*L/2,   -1*L/2,f,-1*d/2,
      0,c,0,   -1*L/2,f,-1*d/2,   -1*L/2,f,d/2,
      0,c,0,   -1*L/2,f,d/2,      -1*d/2,f,L/2,
      0,c,0,   -1*d/2,f,L/2,      d/2,f,L/2,
      0,c,0,   d/2,f,L/2,         L/2,f,d/2,
      0,c,0,   L/2,f,d/2,         L/2,f,-1*d/2,
      0,c,0,   L/2,f,-1*d/2,      d/2,f,-1*L/2,
      0,c,0,   d/2,f,-1*L/2,      -1*d/2,f,-1*L/2
    ]),
    new Float32Array([  // Left Arm
      (w/2)+ct,a+ctw,0,   w+cft,h,w/2,      w+cft,h,-1*w/2,
      (w/2)+ct,a+ctw,0,   w+cft,h,w/2,      w,h,w/2,
      (w/2)+ct,a+ctw,0,   w+cft,h,-1*w/2,   w,h,-1*w/2,
      (w/2)+ct,a+ctw,0,   w,h,-1*w/2,      w,h,w/2
    ]),
    new Float32Array([  // Right Arm
      (-1*w/2)-ct,a+ctw,0,   -1*(w+cft),h,w/2,      -1*(w+cft),h,-1*w/2,
      (-1*w/2)-ct,a+ctw,0,   -1*(w+cft),h,w/2,      -1*w,h,w/2,
      (-1*w/2)-ct,a+ctw,0,   -1*(w+cft),h,-1*w/2,   -1*w,h,-1*w/2,
      (-1*w/2)-ct,a+ctw,0,   -1*w,h,-1*w/2,        -1*w,h,w/2
    ])
  ];

//  console.log(vertexPosList);
  var vertexColorsList = [
    new Float32Array([  // Left Leg
      0.5, 0.3, 0.7,   0.5, 0.3, 0.7,   0.5, 0.3, 0.7,
      0.5, 0.3, 0.7,   0.5, 0.3, 0.7,   0.5, 0.3, 0.7,
      0.5, 0.3, 0.7,   0.5, 0.3, 0.7,   0.5, 0.3, 0.7,
      0.5, 0.3, 0.7,   0.5, 0.3, 0.7,   0.5, 0.3, 0.7
    ]),
    new Float32Array([  // Right Leg
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0
    ]),
    new Float32Array([  // Torso
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0
    ]),
    new Float32Array([  // Head Base
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0
    ]),
    new Float32Array([  // Head Main
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0
    ]),
    new Float32Array([  // Head Top
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      1, 0, 0,   1, 0, 0,   1, 0, 0,
      0, 1, 0,   0, 1, 0,   0, 1, 0,
      1, 1, 0,   1, 1, 0,   1, 1, 0
    ]),
    new Float32Array([  // LefT Arm
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1
    ]),
    new Float32Array([  // Right Arm
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1,
      0, 0, 1,   0, 0, 1,   0, 0, 1
    ])
  ];

  var polygonIndexList = [
    new Uint8Array([  // Left Leg
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10,11
    ]),
    new Uint8Array([  // Right Leg
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10,11
    ]),
    new Uint8Array([  // Torso
      0, 2, 1,
      3, 5, 4,
      8, 7, 6,
      11, 10,9
    ]),
    new Uint8Array([  // Head Base
      0, 2, 1,
      3, 5, 4,
      8, 7, 6,
      11, 10,9,
      12, 13, 14,
      15, 16, 17,
      18, 19, 20,
      21, 22, 23
    ]),
    new Uint8Array([  // Head Main
      0, 2, 1,
      3, 5, 4,
      8, 7, 6,
      11, 10, 9,
      12, 13, 14,
      15, 16, 17,
      18, 19, 20,
      21, 22, 23,
      24, 25, 26,
      27, 28, 29,
      30, 31, 32,
      33, 34, 35,
      36, 37, 38,
      39, 40, 41,
      41, 43, 44,
      45, 46, 47
    ]),
    new Uint8Array([  // Head Top
      0, 2, 1,
      3, 5, 4,
      8, 7, 6,
      11, 10,9,
      12, 13, 14,
      15, 16, 17,
      18, 19, 20,
      21, 22, 23
    ]),
    new Uint8Array([  // Left Arm
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10,11
    ]),
    new Uint8Array([  // Right Arm
      0, 1, 2,
      3, 4, 5,
      6, 7, 8,
      9, 10,11
    ])
  ];

// ---------------------- SCENE DATA END ---------------------------












// ---------------------- INIT BUFFERS START ---------------------------

  // all buffers needed
  var polygonPosBufferList = Array(vertexPosList.length);
  var colorBufferList = Array(vertexColorsList.length);
  var indexBufferList = Array(polygonIndexList.length);

  for(var idx = 0; idx < vertexPosList.length; ++idx) {
    polygonPosBufferList[idx] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, polygonPosBufferList[idx]);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPosList[idx], gl.STATIC_DRAW);
    polygonPosBufferList[idx].itemSize = 3;
    polygonPosBufferList.numItems = vertexPosList[idx].length / 3;
  }

  // init vertex buffers
  for(var idx = 0; idx < vertexColorsList.length; ++idx) {
    colorBufferList[idx] = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferList[idx]);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColorsList[idx], gl.STATIC_DRAW);
    colorBufferList[idx].itemSize = 3;
    colorBufferList.numItems = vertexColorsList[idx].length / 3;
  }

  // init index buffers
  for(var idx = 0; idx < polygonIndexList.length; ++idx) {
    indexBufferList[idx] = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferList[idx]);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, polygonIndexList[idx], gl.STATIC_DRAW);
  }

  // ---------------------- INIT BUFFERS END ---------------------------













// ---------------------- DRAWING START ---------------------------

  var armAngle = Math.PI / 12;
  var legAngle = -1 * Math.PI / 12;
  var headAngle = 0;
  var angIncArm = 0.01;
  var angIncLeg = 0.01;
  var currTime = 0;
  var depth = 0;
  var depthInc = 1.0;
  function draw() {
    // Translate slider values to angles in the [-pi,pi] interval
    var angle1 = slider1.value*0.01*Math.PI;
    var angle2 = slider2.value*0.01*Math.PI;













// ---------------------- TRANSFORMATION START ---------------------------

    // Transformations
    var limbMvmtAxis = [0, 1, 0];
    var eye = [400 * Math.sin(angle1), 450.0, 400.0 * Math.cos(angle1)];
    var target = [0, 0, 0];
    var up = [0, 1, 0];

    var tModelBase = m4.multiply(
        m4.translation([0,0,depth]),
        m4.multiply(
          m4.scaling([2,2,2]),
          m4.axisRotation([1,1,1], angle2)
        )
    );

    var tModelHead = m4.multiply(
        m4.axisRotation([0,1,0], headAngle),
        tModelBase
      );
    var tModelArm = m4.multiply(
      m4.axisRotation(limbMvmtAxis, armAngle),
      tModelBase
    );

    var tModelLeg = m4.multiply(
      m4.axisRotation(limbMvmtAxis, legAngle),
      tModelBase
    );

    var tMVPList = Array(vertexPosList.length);
    var tView = m4.translation([0, -0.7, 0]);
    var tCamera = m4.inverse(m4.lookAt(eye, target, up));
    var tProjection = m4.perspective(Math.PI / 2, 1, 10, 600);

    tMVPList[0] = tModelLeg;
    tMVPList[1] = tModelLeg;
    tMVPList[2] = tModelBase;
    tMVPList[3] = tModelHead;
    tMVPList[4] = tModelHead;
    tMVPList[5] = tModelHead;
    tMVPList[6] = tModelArm;
    tMVPList[7] = tModelArm;


// ---------------------- TRANSFORMATION END ---------------------------













// ---------------------- WEBGL DRAW START ---------------------------
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
  	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw all objects
    for(var idx = 0; idx < vertexPosList.length; ++idx) {
      gl.uniformMatrix4fv(shaderProgram.Mmatrix, false, tMVPList[idx]);
      gl.uniformMatrix4fv(shaderProgram.Pmatrix, false, tProjection);
      gl.uniformMatrix4fv(shaderProgram.Cmatrix, false, tCamera);
      gl.uniformMatrix4fv(shaderProgram.Vmatrix, false, tView);
      gl.uniform1f(shaderProgram.Time, false, currTime);
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBufferList[idx]);
      gl.vertexAttribPointer(shaderProgram.vertexColAttr, colorBufferList[idx].itemSize, gl.FLOAT,
        false, 0, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, polygonPosBufferList[idx]);
      gl.vertexAttribPointer(shaderProgram.vertPosAttr, polygonPosBufferList[idx].itemSize,
        gl.FLOAT, false, 0, 0);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferList[idx]);
      gl.drawElements(gl.TRIANGLES, polygonIndexList[idx].length, gl.UNSIGNED_BYTE, 0);
    }
// ---------------------- WEBGL DRAW END ---------------------------













    armAngle += angIncArm;
    legAngle += angIncLeg;
    if(armAngle >= Math.PI / 12)
      angIncArm = -0.01;
    else if(armAngle <= -1 * Math.PI / 12)
      angIncArm = 0.01;
    if(legAngle >= Math.PI / 12)
      angIncLeg = -0.01;
    else if(legAngle <= -1 * Math.PI / 12)
      angIncLeg = 0.01;
    currTime += 5;
    headAngle += 0.01;
    if(depth >= 100)
      depthInc = -1.0;
    else if(depth < -250)
      depthInc = 1.0;
    depth += depthInc;
    window.requestAnimationFrame(draw);
  }
  draw();
  window.requestAnimationFrame(draw);
};
