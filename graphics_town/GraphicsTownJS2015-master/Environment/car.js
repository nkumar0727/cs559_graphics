/*
 * Created by Nikhil Kumar.
*/
var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var Car = undefined;
var carCount = 0;
var step = 0.2;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    //var a = shdr;


    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Car = function Car(name, position, height, width, depth, color, dirFace, size) {
        this.name = "car"+carCount;
        this.position = position;
        this.currPos = [position[0], position[1], position[2]];
        this.currDir = 0;    // currDir
            // 0 means going towards[0,0,1]
          // 1 means going towards [1,0,0]
          // 2 means going towards [0,0,-1]
          // 3 means going towards [-1,0,0]

    //    this.position = position || [0,0,0];
      //  this.size = size || 1.0;
        this.height = height || 0.5;
        this.width = width || 0.25;
        this.depth = depth || 0.05;
      //  this.color = color || [.2,.5,.3];
        //*/
        this.base = new Rect("car"+carCount, position, height, width, depth, color, dirFace | 0, size);
        this.front = new Rect("car"+carCount, [position[0]+width, position[1], position[2]],
          height*3/4, width*3/4, depth/4, color, dirFace | 0, size);
        //this.dirFace = dirFace;
        carCount += 1;
    }
    Car.prototype.init = function(drawingState) {
        this.base.init(drawingState);
        this.front.draw(drawingState);
    };
    Car.prototype.draw = function(drawingState) {
        // 0 if simply step forward
        // 1 if turning needed
        var progress = 0;
        switch(this.currDir) {
            case 0:
                if(this.base.position[2] + step >= centerSz + 0.2) {
                    progress = 1;
                    this.currDir = 1;
                }
                else {
                  this.base.position[2] += step;
                  this.front.position[2] += step;
                }
                break;
            case 1:
                if(this.base.position[0] + step >= centerSz + 0.2) {
                    progress = 1;
                    this.currDir = 2;
                }
                else {
                    this.base.position[0] += step;
                    this.front.position[0] += step;
                }
                break;
            case 2:
                if(this.base.position[2] - step <= -centerSz - 0.2) {
                    progress = 1;
                    this.currDir = 3;
                }
                else {
                  this.base.position[2] -= step;
                  this.front.position[2] -= step;
                }
                break;
            case 3:
                if(this.base.position[0] - step <= -centerSz - 0.2) {
                    progress = 1;
                    this.currDir = 0;
                }
                else {
                  this.base.position[0] -= step;
                  this.front.position[0] -= step;
                }
                break;
        }
        if(progress == 1) {
          this.front.position = [this.base.position[0] + this.width,
            this.base.position[1], this.base.position[2]];
        }

        this.base.draw(drawingState, progress, this.currDir);
        this.front.draw(drawingState, progress, this.currDir);
    };
    Car.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.


grobjects.push(new Car("Car1", [-centerSz,0.0,2.0], 1,1.0,2.0, [0.4,0.8,0.6], 0, 1));
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
