/*
 * Created by Nikhil Kumar.
*/
var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var Flag = undefined;
var flagCount = 0;
//var DoorRect = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;



    // constructor for Cubes
    Flag = function Flag(name, position, height, width, depth, color, dirFace, size) {
        this.name = "flag"+flagCount;
        /*
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.height = height || 0.5;
        this.width = width || 0.25;
        this.depth = depth || 0.05;
        this.color = color || [.2,.5,.3]; */

        this.base = new Rect("rect"+flagCount, position, height, width, depth, color, dirFace | 0, size);
        this.rotor1 = new Pyramid("pyramid"+flagCount, [position[0], position[1]+height-0.5, position[2]], 1.5,0.5,0.5, [0.8,0.8,0], 4, 1.0);
        this.rotor2 = new Pyramid("pyramid"+flagCount, [position[0], position[1]+height-0.5, position[2]], 1.5,0.5,0.5, [0.8,0.8,0], 5, 1.0);
        flagCount += 1;
        this.dirFace = dirFace;
    }
    Flag.prototype.init = function(drawingState) {
        this.base.init(drawingState);
        this.rotor1.init(drawingState);
        this.rotor2.init(drawingState);
    };
    Flag.prototype.draw = function(drawingState) {
        this.base.draw(drawingState);
        this.rotor1.draw(drawingState);
        this.rotor2.draw(drawingState);
    };
    Flag.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
//Flag = function Flag(name, position, height, width, depth, color, dirFace, size) {
grobjects.push(new Flag("flag1", [0,0,0], 5.0, 0.2, 0.2, [0.8, 0, 0.8], 0, 1));
//grobjects.push(new Rect("rect1", [0.0,0.5,0.0], 1,0.5,0.25));
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
