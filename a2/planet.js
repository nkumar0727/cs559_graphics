// Functions and objects related to representing and
// drawing planets and their orbits.

function drawSun(ctx) {
  ctx.strokeStyle = "orange";
  ctx.fillStyle = "orange";
  ctx.beginPath();
  ctx.arc(0, 0, 40, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();

  ctx.fillStyle = "white";
  ctx.fillText("SUN", 50, 0);
}


/*
 * time - internal counter for position along orbit
 *
 * eccen - orbital eccentricity
 * smja - semi-major axis length
 * rprd - rotation period
 * mass - duh
 * col - colour
 * focd - focal distance (distance from sun)
 *
 * Important equations:
 *    eccen = smja / focd
 *    smna (semi-minor axis) = sqrt(smja ^2 - focd^2)
 */
function Planet(name, eccen, smja, rprd, oprd, rad, col, rings, ctx) {
  this.nm = name;
  this.eccen = eccen;
  this.smja = smja;
  this.rprd = rprd;
  this.oprd = oprd;
  this.col = col;
  this.rad = rad;
  this.rings = rings;

  this.focd = smja * eccen;
  this.smna = Math.sqrt(this.smja * this.smja - this.focd * this.focd);

  this.ctx = ctx;
  this.theta = Math.random() * Math.PI * 2;
  this.time = 0;
}

Planet.prototype.drawOrbit = function() {
  this.ctx.strokeStyle = "white";
  var inc = 0.01;
  this.ctx.beginPath();
  for(var theta = inc; theta <= 2 * Math.PI; theta += inc) {
    this.ctx.lineTo(this.smja * Math.cos(theta), this.smna * Math.sin(theta));
  }
  this.ctx.closePath();
  this.ctx.stroke();
}

Planet.prototype.drawPlanet = function(speed) {
  this.ctx.save();
  var xPos = this.smja * Math.cos(this.theta);
  var yPos = this.smna * Math.sin(this.theta);

  this.ctx.translate(xPos, yPos);
  this.ctx.save();
  this.ctx.rotate((this.time / this.rprd) * 6 * Math.PI);

  this.time += 1;
  if(this.time > this.rprd)
    this.time = 0;

  if(this.rings) {
    this.ctx.strokeStyle = "white";
    var inc = 0.01;
    var aVal = this.rad * 2;
    var bVal = this.rad / 2;
    this.ctx.beginPath();
    for(var theta = inc; theta <= 2 * Math.PI; theta += inc) {
      this.ctx.lineTo(aVal * Math.cos(theta), bVal * Math.sin(theta));
    }
    this.ctx.closePath();
    this.ctx.stroke();
  }

  this.ctx.fillStyle = this.col;
  this.ctx.strokeStyle = this.col;
  this.ctx.beginPath();
  this.ctx.arc(0, 0, this.rad, 0, 2 * Math.PI);
  this.ctx.stroke();
  this.ctx.fill();

  this.ctx.restore();
  this.ctx.fillStyle = "white";
  this.ctx.fillText(this.nm, this.rad + 2, this.rad + 2);

  this.theta += speed * (0.015 / (this.oprd));
  this.theta = this.theta % (2 * Math.PI);
  this.ctx.restore();
}
