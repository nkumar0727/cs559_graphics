/*
 * Created by Nikhil Kumar.
*/
var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var House = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all houses - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    var houseCount = 0; // total number of houses; used as an identifier

    // constructor for Cubes
    House = function House(name, position, height, width, depth, doorWidth,
      baseColor, roofColor, doorColor, size) {    // CHANGE: color -> baseColor
        var downScale = 0.75;
        var doorThick = 0.25;
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
      //  this.cube = new Cube("cube" + houseCount, [0.0,0.5,0.0], 1, roofColor | [0.7,0.2,0.2]);
      //Rect = function Rect(name, position, height, width, depth, color, size) {
        this.base = new Rect("rect"+houseCount, position, height, width, depth, baseColor, size);
      //  Pyramid = function Pyramid(name, position, height, width, color, size) {
        this.roof = new Pyramid("pyramid"+houseCount, [0.0,position[1] + height,0.0],
          height * downScale, width, depth,roofColor, size);
        this.door = new Door("d_rect"+houseCount, [position[0] + width/2 - doorWidth/2,
          position[1], position[2] + depth], height * downScale,
          doorWidth, doorThick, doorColor);
        houseCount += 1;
    }
    House.prototype.init = function(drawingState) {
        this.base.init(drawingState);
        this.roof.init(drawingState);
        this.door.init(drawingState);
    };
    House.prototype.draw = function(drawingState) {
        this.base.draw(drawingState);
        this.roof.draw(drawingState);
        this.door.draw(drawingState);
    };
    House.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
function findObj(name) {
    var rv = null;
    grobjects.forEach(function(obj) {
        if (obj.name == name) {
            rv = obj;
        }
    });
    return rv;
};
//House = function House(name, position, height, width, depth, doorWidth,
//  baseColor, roofColor, doorColor, size) {
grobjects.push(new House("house1", [0.0,0.0,0.0], 1.5, 2.0, 1.0, 0.5));
/*
grobjects.push(new Cube("cube1",[-2,0.5,   0],1) );
grobjects.push(new Cube("cube2",[ 2,0.5,   0],1, [1,1,0]));
grobjects.push(new Cube("cube3",[ 0, 0.5, -2],1 , [0,1,1]));
grobjects.push(new Cube("cube4",[ 0,0.5,   2],1));

grobjects.push(new SpinningCube("scube 1",[-2,0.5, -2],1) );
grobjects.push(new SpinningCube("scube 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
grobjects.push(new SpinningCube("scube 4",[ 2,0.5,  2],1));
*/
