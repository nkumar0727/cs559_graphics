function setup() {
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");
  var m4 = twgl.m4;

  var zAxisRot = document.getElementById("slider1");
  zAxisRot.value = Math.PI/4;

  var yAxisRot = document.getElementById("slider2");
  yAxisRot.value = -1*Math.PI/2.25;

  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output
  function moveToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx, loc);
    context.moveTo(locTx[0], locTx[1]);
  }

  function moveToTxAlt(loc, Tx) {
    var locTx = m4.transformPoint(Tx, loc);
    context.moveTo(locTx[0], locTx[1]);
  }

  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output
  function lineToTx(x,y,z,Tx) {
    var loc = [x,y,z];
    var locTx = m4.transformPoint(Tx,loc);
    context.lineTo(locTx[0], locTx[1]);
  }

  function lineToTxAlt(loc, Tx) {
    var locTx = m4.transformPoint(Tx, loc)
    context.lineTo(locTx[0], locTx[1])
  }

  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output
  function drawAxes(Tx) {
    context.lineWidth = 3;
    context.beginPath(); context.strokeStyle="blue"; moveToTx(0,0,0,Tx);
    lineToTx(400,0,0,Tx); context.stroke(); context.closePath();

    context.beginPath(); context.strokeStyle="black"; moveToTx(0,0,0,Tx);
    lineToTx(0,400,0,Tx); context.stroke(); context.closePath();

    context.beginPath(); context.strokeStyle="red"; moveToTx(0,0,0,Tx);
    lineToTx(0,0,400,Tx); context.stroke(); context.closePath();
  }

  // Triangle stuff
  function Triangle() {
    this.vert = [[0,0,0],
                 [0,1,0],
                 [1,1,0]];
    this.Tmodel = m4.identity();
  }

  Triangle.prototype.draw = function() {
    context.lineWidth = 3;
    context.fillStyle = "red";
    context.strokeStyle = "black";
    moveToTxAlt(this.vert[2], this.Tmodel);
    context.beginPath();
    for(var i = 0; i < 3; ++i) {
      lineToTxAlt(this.vert[i], this.Tmodel);
    }
    context.closePath();
    context.stroke();
    context.fill();
  }


  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output

  // taken from cs559 example
  // link: http://jsbin.com/sitokubesa/edit?html,js,output

  var xAxis = [1,0,0];
  var yAxis = [0,1,0];
  var zAxis = [0,0,1];

  var Tbase = m4.multiply(m4.scaling([1,-1,1]), m4.translation([400,400,0]));
  var Ttri = m4.multiply(m4.scaling([100,100,100]), Tbase);

  function draw() {
    canvas.width = canvas.width;

    var eye = [200 * Math.cos(zAxisRot.value),
      400 * Math.cos(yAxisRot.value), 200 * Math.sin(zAxisRot.value)];

    var target = [0,0,0];
    var up = [0,1,0];

    var Tcamera = m4.multiply(m4.inverse(m4.lookAt(eye, target, up)), Tbase);
    var Tfinal = m4.multiply(Ttri, Tcamera);

    var t1 = new Triangle();
    drawAxes(Tcamera);
    t1.Tmodel = Tfinal;
    console.log(t1.Tmodel);

    // var t2 = new Triangle();
    // t2.Tmodel = m4.multiply(m4.axisRotation(zAxis, Math.PI / -2), Tbase);
    // m4.translate(Tcamera, [1,0,0], t2.Tmodel);
    // console.log(t2.Tmodel);


    t1.draw();
    // t2.draw();
    // window.requestAnimationFrame(draw);
  }
  draw();
  zAxisRot.addEventListener("input", draw);
  yAxisRot.addEventListener("input", draw);
  // window.requestAnimationFrame(draw);
}
window.onload = setup;
