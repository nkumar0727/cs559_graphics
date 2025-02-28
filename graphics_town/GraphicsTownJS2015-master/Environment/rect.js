/*
 * Created by Nikhil Kumar.
*/
var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var Rect = undefined;
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
    Rect = function Rect(name, position, height, width, depth, color, dirFace, 
        size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.height = height || 0.5;
        this.width = width || 0.25;
        this.depth = depth || 0.05;
        this.color = color || [.2,.5,.3];

        this.dirFace = dirFace;
    }
    Rect.prototype.init = function(drawingState) {
       // console.log("inside init");
        var gl = drawingState.gl;
        if(!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rect-vs", "rect-fs"]);
        }
        if(!buffers) {
            var arrays = {
                //  3 components = triangles
                vpos: { numComponents: 3, data: [
                    // make sure that these are in same order as cube triangles
                    0,1,0, 0,0,0, 1,0,0,   1,0,0, 1,1,0, 0,0,0,  // back
                    0,1,1, 0,0,1, 1,0,1,   1,0,1, 1,1,1, 0,1,1,  // front
                    0,0,0, 0,0,1, 1,0,1,   1,0,1, 1,0,0, 0,0,0,  // hottom
                    0,1,0, 0,1,1, 1,1,1,   1,1,1, 1,1,0, 0,1,0,  // top
                    0,0,0, 0,0,1, 0,1,0,     0,1,0, 0,1,1, 0,0,1,    // left
                    1,0,0, 1,0,1, 1,1,0,     1,1,0, 1,1,1, 1,0,1,    // right
                ]},
                vnormal : { numComponents: 3, data : [
                    // normals for cube part
                    0,0,-1, 0,0,-1, 0,0,-1,     0,0,-1, 0,0,-1, 0,0,-1,
                    0,0,1, 0,0,1, 0,0,1,        0,0,1, 0,0,1, 0,0,1,
                    0,-1,0, 0,-1,0, 0,-1,0,     0,-1,0, 0,-1,0, 0,-1,0,
                    0,1,0, 0,1,0, 0,1,0,        0,1,0, 0,1,0, 0,1,0,
                    -1,0,0, -1,0,0, -1,0,0,     -1,0,0, -1,0,0, -1,0,0,
                    1,0,0, 1,0,0, 1,0,0,        1,0,0, 1,0,0, 1,0,0,
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
    };
    Rect.prototype.draw = function(drawingState, progress, dir) {
       
        var modelM = twgl.m4.identity();
        //var modelM = twgl.m4.scaling([this.width, this.height, this.depth]);
        twgl.m4.translate(modelM, [this.position[0],
          this.position[1], this.position[2]], modelM);
          // dirFace                      // 0 means door faces [0,0,1]
                                          // 1 means door faces [1,0,0]
                                          // 2 means door faces [0,0,-1]
                                          // 3 means door faces [-1,0,0]
          switch(this.dirFace) {
              case 3:
                  // rotate about y axis -pi/2
                  twgl.m4.rotateY(modelM, Math.PI/2, modelM);
                  break;
              case 2:
                  // rotate about y axis pi
                  twgl.m4.rotateY(modelM, Math.PI, modelM);
                  break;
              case 1:
                  // rotate about y axis pi/2
                  twgl.m4.rotateY(modelM, Math.PI/2, modelM);
                  break;
              // default is 0; do nothing
          }

          if(progress != null && dir != null) {
            for(var i = 0; i < dir; ++i) {
              twgl.m4.rotateY(modelM, -Math.PI/2, modelM);
            }
          }


        twgl.m4.scale(modelM, [this.size*this.width,
            this.size*this.height, this.size*this.depth], modelM);
            var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view,
            proj: drawingState.proj,
            lightdir: drawingState.sunDirection,
            cubecolor: this.color,
            model: modelM
        });
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Rect.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
/*
*Rect = function Rect(name, position, height, width, depth, color, dirFace, 
        size, texture_input) {
*/
//grobjects.push(new Rect("rect1", [0.0,0.5,0.0], 3,3,3, [0.0,0.4,0.8], 0, 1));
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
