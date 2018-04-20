/*
 * Created by Nikhil Kumar.
*/
var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var Door = undefined;
//var DoorRect = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var shaderProgram = undefined;
    var buffers = undefined;

    // Constructor for Door (opens and closes over time)
    Door = function DoorRect(name, position, height, width, depth, color, dirFace, rectLength, rectDepth, texture_input,size) {
      this.name = name;
      this.position = position || [0,0,0];
      this.size = size || 1.0;
      this.height = height || 0.5;
      this.width = width || 0.25;
      this.depth = depth || 0.05;
      this.color = color || [.8,.7,.2];

      this.dirFace = dirFace;
      this.rectLength = rectLength;
      this.rectDepth = rectDepth;

      this.lastOpened = -1; // to be set in init
      this.openTime = Math.random() * 5000;
      this.doorAngle = 0;
      this.doorStatus = 0;

    this.texture_input = texture_input;
      this.texture = undefined;
    };
    //DoorRect.prototype = Object.create(Rect.prototype);
    Door.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if(!shaderProgram) {
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if(!buffers) {
            var d = this.depth; var w = this.width; var h = this.height;
            var arrays = {
                //  3 components = triangles
                vpos: { numComponents: 3, data: [
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
                ]},
                vtex : { numComponents: 2, data : [
                    0.25,0, 0,0, 0,1,      0.25,0,  0,1,  0.25,1,      // back
                    0.5,0, 0.75,0, 0.75,1,      0.5,0,    0.75,1,  0.5,1,        // front
                    0,0, 0,0, 0,0,      0,0,    0,0,  0,0,        // bottom
                    0,0, 0,0, 0,0,      0,0,    0,0,  0,0,        // top
                    0.25,0, 0.25,1, 0.5,1,      0.25,0,    0.5,1,  0.5,0,        // left
                    1,0, 1,1, 0.75,1,      1,0,    0.75,1,  0.75,0,        // right
                ]}
            };
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
        if(!this.texture) {
            this.texture = twgl.createTexture(gl, {
                src : this.texture_input ,
                //wrap : gl.REPEAT,
                crossOrigin: "anonymous",
            });
            //window.setTimeout(this.draw, 200);
        }
    };
    Door.prototype.draw = function(drawingState) {
        // apply transforms for opening and closing
        //-- use drawingState.realtime
        var modelM = twgl.m4.identity();
        twgl.m4.translate(modelM, this.position, modelM);
        // dirFace                      // 0 means door faces [0,0,1]
                              // 1 means door faces [1,0,0]
                              // 2 means door faces [0,0,-1]
                              // 3 means door faces [-1,0,0]
        switch(this.dirFace) {
            case 3:
                // rotate about y axis -pi/2
                twgl.m4.rotateY(modelM, -Math.PI/2, modelM);
                twgl.m4.translate(modelM, [-1*this.rectLength - this.width/2,0,this.rectDepth - this.depth], modelM);
                break;
            case 2:
                // rotate about y axis pi
                twgl.m4.rotateY(modelM, Math.PI, modelM);
                twgl.m4.translate(modelM, [this.rectLength - this.width,0,2*this.rectDepth], modelM);
                break;
            case 1:
                // rotate about y axis pi/2
                twgl.m4.rotateY(modelM, Math.PI/2, modelM);
                twgl.m4.translate(modelM, [this.rectLength - this.width/2,0,this.depth], modelM);
                break;
            // default is 0; do nothing
        }
        twgl.m4.scale(modelM, [this.size*this.width, this.size*this.height, this.size*this.depth], modelM);

        var gl = drawingState.gl;
        if(this.doorStatus == 0 && drawingState.realtime - this.lastOpened > this.openTime) {
          this.doorAngle = 0;
          this.doorStatus = 1;
        }
        if(this.doorStatus == 1) {
          if(this.doorAngle > -Math.PI/2)
            this.doorAngle -= 0.01;
          else
            this.doorStatus = 2;
        }
        else if(this.doorStatus == 2) {
          if(this.doorAngle < 0)
            this.doorAngle += 0.01;
          else {
            this.doorStatus = 0;
            this.doorAngle = 0;
            this.lastOpened = drawingState.realtime;
          }
        }
        twgl.m4.rotateY(modelM, this.doorAngle, modelM);

        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view,
            proj: drawingState.proj,
            lightdir: drawingState.sunDirection,
            cubecolor: this.color,
            model: modelM, 
            texSampler: this.texture
        });

        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    };
    Door.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.

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
