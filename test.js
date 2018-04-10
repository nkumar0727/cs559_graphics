function setup() {
  var canvas = document.getElementById('myCanvas');
  var context = canvas.getContext('2d');
  var m4 = twgl.m4;

  var slider1 = document.getElementById('slider1');
  slider1.value = 0;
  var slider2 = document.getElementById('slider2');
  slider2.value = 0;

  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.moveTo(locTx[0],locTx[1]);
  }

  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.lineTo(locTx[0],locTx[1]);
  }

  function drawAxes(Tx) {
    // A little cross on the front face, for identification
    moveToTx(0,0,0,Tx);lineToTx(100,0,0,Tx);context.stroke();
    moveToTx(0,0,0,Tx);lineToTx(0,150,0,Tx);context.stroke();
    moveToTx(0,0,0,Tx);lineToTx(0,0,200,Tx);context.stroke();
  }

  function drawCube(Tx) {
    // A little cross on the front face, for identification
    moveToTx(180,200,100,Tx);lineToTx(220,200,100,Tx);context.stroke();
    moveToTx(200,180,100,Tx);lineToTx(200,220,100,Tx);context.stroke();
    // Twelve edges of a cube
    moveToTx(100,100,100,Tx);lineToTx(300,100,100,Tx);
    lineToTx(300,300,100,Tx);lineToTx(100,300,100,Tx);context.stroke();
    moveToTx(300,100,100,Tx);lineToTx(300,100,300,Tx);
    lineToTx(300,300,300,Tx);lineToTx(300,300,100,Tx);context.stroke();
    moveToTx(300,100,300,Tx);lineToTx(100,100,300,Tx);
    lineToTx(100,300,300,Tx);lineToTx(300,300,300,Tx);context.stroke();
    moveToTx(100,100,300,Tx);lineToTx(100,100,100,Tx);
    lineToTx(100,300,100,Tx);lineToTx(100,300,300,Tx);context.stroke();
  }

  function draw() {
    // hack to clear the canvas fast
    canvas.width = canvas.width;

    var angle1 = slider1.value*0.01*Math.PI;
    var angle2 = slider2.value*0.01*Math.PI;
    var axis = [1,1,1];

    var Tmodel=m4.axisRotation(axis,angle2);

    var eye=[700*Math.cos(angle1),400,700*Math.sin(angle1)];
    var target=[0,0,0];
    var up=[0,1,0];
    var Tcamera=m4.inverse(m4.lookAt(eye,target,up));

    //var Tprojection=m4.ortho(-250,250,-200,300,-2,2);
    var Tprojection=m4.perspective(Math.PI/3,1,5,100);

    var Tviewport=m4.multiply(m4.scaling([200,-200,200]),m4.translation([200,200,0]));

    var Tcpv=m4.multiply(m4.multiply(Tcamera,Tprojection),Tviewport);
    var Tmcpv=m4.multiply(Tmodel,Tcpv);

    drawCube(Tmcpv);
    drawAxes(Tcpv);
  }

  slider1.addEventListener("input",draw);
  slider2.addEventListener("input",draw);
  draw();

}
window.onload = setup;
