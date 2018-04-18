/*
 * Created by Nikhil Kumar.
*/
var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var House = undefined;
var houseCount = 0; // total number of houses; used as an identifier
// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all houses - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;



    // constructor for Cubes
    House = function House(name, position, height, width, depth, doorWidth,  dirFace,
      baseColor, roofColor, doorColor, size) {    // CHANGE: color -> baseColor
        var downScale = 0.75;
        var doorThick = 0.25;
        this.name = "house"+houseCount;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        // dirFace                      // 0 means door faces [0,0,1]
                                        // 1 means door faces [1,0,0]
                                        // 2 means door faces [0,0,-1]
                                        // 3 means door faces [-1,0,0]

        var rotDoorCoords = [position[0]+ width/2 - doorWidth/2, position[1], position[2]+depth];

            //rotDoorCoords[z, y, x];
            /*
        if(dirFace == 1)
            rotDoorCoords[-position[2]+depth, position[1],position[0]+(width/2 - doorWidth/2)];
        console.log(rotDoorCoords);
        */
      //  this.cube = new Cube("cube" + houseCount, [0.0,0.5,0.0], 1, roofColor | [0.7,0.2,0.2]);
      //Rect = function Rect(name, position, height, width, depth, color, size) {
        this.base = new Rect("rect"+houseCount, position, height, width, depth, baseColor, dirFace | 0, size);
      //  Pyramid = function Pyramid(name, position, height, width, color, size) {
        this.roof = new Pyramid("pyramid"+houseCount, [position[0], position[1]+height, position[2]],
          height * downScale, width, depth,roofColor, dirFace | 0, size);
        this.door = new Door("d_rect"+houseCount, rotDoorCoords, height * downScale,
          doorWidth, doorThick, doorColor, dirFace | 0, width, depth);
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
/*
* Create houses around border of my town, and perhaps one in the middle.
*/
//grobjects.push(new House("house1", [0.0,0.0,0.0], 1.5, 2.0, 1.0, 0.5, 0));
//grobjects.push(new House("house1", [-planeSz,0.0,0.0], 1.5, 2.0, 1.0, 0.5, 1));
//grobjects.push(new House("house1", [-planeSz,0.0,0.0], 1.5, 2.0, 1.0, 0.5, 2));
// LHS HOUSES

grobjects.push(new House("house1", [-planeSz+1.2,0.0,planeSz/2], 1.5, 2.0, 1.0, 0.5, [0.4,0.3,0.6], [0.2,0.3,0.8], [0.7,0.6,0,2]));
grobjects.push(new House("house1", [-planeSz+1.2,0.0,-planeSz/2], 1.5, 2.0, 1.0, 0.5, 1, [0.7,0.2,0.1], [0.8,0.3,0.8], [0.2,0.3,0.7]));
grobjects.push(new House("house1", [-planeSz+1.2,0.0,planeSz/2 -3.0], 1.5, 2.0, 1.0, 0.5, 1, [0.3,0.8,0.2], [0.1,0.1,0.2], [0.7,0.6,0.5]));
grobjects.push(new House("house1", [-planeSz+1.2,0.0,-planeSz/2 + 3.0], 1.5, 2.0, 1.0, 0.5, 1, [0.1,0.1,0.6], [0.8,0.5,0.5], [0.2,0.9,0.8]));

// RHS HOUSES
grobjects.push(new House("house1", [planeSz-1.2,0.0,planeSz/2], 1.5, 2.0, 1.0, 0.5, 3, [0.7,0.6,0.4], [0.2,0.3,0.8], [0.1,0.4,0.2]));
grobjects.push(new House("house1", [planeSz-1.2,0.0,-planeSz/2], 1.5, 2.0, 1.0, 0.5, 3, [0.8,0.9,0.2], [0.1,0.3,0.1], [0.9,0.6,0.4]));
grobjects.push(new House("house1", [planeSz-1.2,0.0,planeSz/2 -3.0], 1.5, 2.0, 1.0, 0.5, 3, [0.3,0.3,0.3], [0.8,0.5,0.4], [0.2,0.1,0.3]));
grobjects.push(new House("house1", [planeSz-1.2,0.0,-planeSz/2 + 3.0], 1.5, 2.0, 1.0, 0.5, 3, [0.7,0.1,0.1], [0.2,0.3,0.6], [0.1,0.3,0.2]));
//grobjects.push(new House("house1", [0.0,0.0,centerSz], 1.5, 2.0, 1.0, 0.5, 3));
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
