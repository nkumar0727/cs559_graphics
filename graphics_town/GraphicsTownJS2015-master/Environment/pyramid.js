/*
 * Created by Nikhil Kumar.
*/

var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var Pyramid = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Pyramid
    Pyramid = function Pyramid(name, position, height, width, depth, color, dirFace, size) {
        this.name = name;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.height = height || 0.5;
        this.width = width || 0.25;
        this.depth = depth || 0.25;
        this.color = color || [.2,.3,.8];

        this.flagAngle = 0;

        this.dirFace = dirFace;
    }
    Pyramid.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if(!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["rect-vs", "rect-fs"]);
        }
        if(!buffers) {
            var arrays = {
                //  3 components = triangles
                vpos: { numComponents: 3, data: [
                    // make sure that these are in same order as cube triangles
                    0,0,0, 1,0,0, 0.5,1,0.5,  // back
                    1,0,0, 1,0,1, 0.5,1,0.5,  // right
                    1,0,1, 0,0,1, 0.5,1,0.5,  // front
                    0,0,1, 0,0,0, 0.5,1,0.5,  // left
                    /*
                    -w, 0.0, -d,   w, 0.0, -d,   0.0, h, 0.0,
                     w, 0.0, -d,   w, 0.0, d,    0.0, h, 0.0,
                     w, 0.0, d,   -w, 0.0, d,    0.0, h, 0.0,
                    -w, 0.0, d,   -w, 0.0, -d,   0.0, h, 0.0,
                    */
                ]},
                vnormal : { numComponents: 3, data : [
                    // normals for pyramid part -- fix these...
                    0,-1,1, 0,-1,1, 0,-1,1,
                    -1,-1,0, -1,-1,0, -1,-1,0,
                    0,-1,-1, 0,-1,-1, 0,-1,-1,
                    1,-1,0, 1,-1,0, 1,-1,0,
                    /*
                    0,0.5,-1.0, 0,0.5,-1.0, 0,0.5,-1.0,  // trignale 1
                    1.0,0.5,0.0, 1.0,0.5,0.0, 1.0,0.5,0.0,  // triangle 2
                    0,-0.5,-1.0, 0,-0.5,-1.0, 0,-0.5,-1.0,   // triangle 3
                    -1.0,0.5,0.0, -1.0,0.5,0.0, -1.0,0.5,0.0,   // triangle 4
                    */
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
    };
    Pyramid.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.identity();
        //twgl.m4.scale(modelM, [this.size, this.size, this.size], modelM);
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
            case 4:
                // SPECIAL; rotate about Z-axis
                twgl.m4.rotateZ(modelM, Math.PI/2, modelM);
                break;
            case 5:
                // SPECIAL :rotate about Z-axis other way
                twgl.m4.rotateZ(modelM, -Math.PI/2, modelM);
                break;
            // default is 0; do nothing
        }
        twgl.m4.setTranslation(modelM, this.position, modelM);

        if(this.dirFace == 4 || this.dirFace == 5) {// if this is a flag, rotate about Y in circle
            twgl.m4.rotateX(modelM, this.flagAngle, modelM);
            this.flagAngle += 0.01;
        }
        else if(this.dirFace == 6) {
            twgl.m4.rotateY(modelM, this.flagAngle, modelM);
            this.flagAngle += 0.01;
        }

        twgl.m4.scale(modelM, [this.width,this.height, this.depth], modelM);
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
    Pyramid.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

//grobjects.push(new Pyramid("pyramid1", [0.0,0.5,0.0], 1, 1));
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
