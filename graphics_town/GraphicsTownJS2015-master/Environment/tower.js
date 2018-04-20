/**
 * Created by gleicher on 10/9/15.
 */
/*
 a second example object for graphics town
 check out "simplest" first

 the cube is more complicated since it is designed to allow making many cubes

 we make a constructor function that will make instances of cubes - each one gets
 added to the grobjects list

 we need to be a little bit careful to distinguish between different kinds of initialization
 1) there are the things that can be initialized when the function is first defined
    (load time)
 2) there are things that are defined to be shared by all cubes - these need to be defined
    by the first init (assuming that we require opengl to be ready)
 3) there are things that are to be defined for each cube instance
 */
var grobjects = grobjects || [];

// allow the two constructors to be "leaked" out
var Tower = undefined;
var towerCount = 0;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Cubes
    Tower = function Tower(name, position, size, color, texture_input) {
       this.name = "tower"+towerCount;
       this.position = position;
       this.size = size | 1;

       this.base = new Cube("cube", position, size*2, texture_input, color);
       this.middle = new Cube("cube", [position[0], position[1]+size, position[2]], size*1.5, texture_input, color);
       this.top = new Cube("cube", [position[0], position[1]+2*size, position[2]], size, texture_input, color);
       this.roof = new Pyramid("pyramid", [position[0]-size/2, position[1]+2*size, position[2]-size/2], size*1.5, size, size, color, 0, size,LoadedImageFiles["roof.jpg"].src );
       towerCount += 1;
    }
    Tower.prototype.init = function(drawingState) {
        this.base.init(drawingState);
        this.middle.init(drawingState);
        this.top.init(drawingState);
        this.roof.init(drawingState);
    };
    Tower.prototype.draw = function(drawingState) {
        this.base.draw(drawingState);
        this.middle.draw(drawingState);
        this.top.draw(drawingState);
        this.roof.draw(drawingState);
    };
    Tower.prototype.center = function(drawingState) {
        return this.position;
    }


})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Tower("tower1", [2,0.5,2], 0.5, [1,1,1], LoadedImageFiles["roof.jpg"].src));
grobjects.push(new Tower("tower1", [1,0.5,3.5], 0.5, [1,1,1], LoadedImageFiles["wood.jpg"].src));
grobjects.push(new Tower("tower1", [-2,1,-2], 1, [1,1,1], LoadedImageFiles["zz.jpg"].src));
grobjects.push(new Tower("tower1", [-2,1,2], 1, [1,1,1], LoadedImageFiles["grant.jpg"].src));
grobjects.push(new Tower("tower1", [2,2,-2], 2, [1,2,1], LoadedImageFiles["trump.jpg"].src));
/*
grobjects.push(new Cube("cube2",[ 2,0.5,   0],1, [1,1,0]));
grobjects.push(new Cube("cube3",[ 0, 0.5, -2],1 , [0,1,1]));
grobjects.push(new Cube("cube4",[ 0,0.5,   2],1));

grobjects.push(new SpinningCube("scube 1",[-2,0.5, -2],1) );
grobjects.push(new SpinningCube("scube 2",[-2,0.5,  2],1,  [1,0,0], 'Y'));
grobjects.push(new SpinningCube("scube 3",[ 2,0.5, -2],1 , [0,0,1], 'Z'));
grobjects.push(new SpinningCube("scube 4",[ 2,0.5,  2],1));
*/
