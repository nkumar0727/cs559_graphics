/*
 * Created by Nikhil Kumar.
*/

var grobjects = grobjects || [];

// allow the constructor to be "leaked" out
var Sphere = undefined;

// this is a function that runs at loading time (note the parenthesis at the end)
(function() {
    "use strict";

    // i will use this function's scope for things that will be shared
    // across all cubes - they can all have the same buffers and shaders
    // note - twgl keeps track of the locations for uniforms and attributes for us!
    var sphereCount = 0;

    var shaderProgram = undefined;
    var buffers = undefined;

    // constructor for Pyramid
    Sphere = function Sphere(name, position, size, texture_input) {
        this.name = "sphere"+sphereCount;
        sphereCount += 1;
        this.position = position || [0,0,0];
        this.size = size || 1.0;
        this.texture_input = texture_input;
        this.texture = undefined;
        this.latitudeBands = 30;
        this.longitudeBands = 30;
        this.radius = 2;
        // create subobjects that compose the main object
    }
    Sphere.prototype.init = function(drawingState) {
        var gl = drawingState.gl;
        if(!shaderProgram){
            shaderProgram = twgl.createProgramInfo(gl, ["cube-vs", "cube-fs"]);
        }
        if(!buffers) {
            var arrays = {
                vpos: { numComponents: 3, data: []},
                vnormal: { numComponents: 3, data: []},
                vtex: { numComponents: 2, data: []},
                idx: { numComponents: 3, data: []}
            };
            for (var latNumber = 0; latNumber <= this.latitudeBands; latNumber++) {
                var theta = latNumber * Math.PI / this.latitudeBands;
                var sinTheta = Math.sin(theta);
                var cosTheta = Math.cos(theta);
              
                for (var longNumber = 0; longNumber <= this.longitudeBands; longNumber++) {
                  var phi = longNumber * 2 * Math.PI / this.longitudeBands;
                  var sinPhi = Math.sin(phi);
                  var cosPhi = Math.cos(phi);
              
                  var x = cosPhi * sinTheta;
                  var y = cosTheta;
                  var z = sinPhi * sinTheta;
                  var u = 1 - (longNumber / this.longitudeBands);
                  var v = 1 - (latNumber / this.latitudeBands);
              
                  arrays.vnormal.data.push(x);
                  arrays.vnormal.data.push(y);
                  arrays.vnormal.data.push(z);
                  arrays.vtex.data.push(u);
                  arrays.vtex.data.push(v);
                  arrays.vpos.data.push(this.radius * x);
                  arrays.vpos.data.push(this.radius * y);
                  arrays.vpos.data.push(this.radius * z);
                }
              }
              
              for (var latNumber = 0; latNumber < this.latitudeBands; latNumber++) {
                for (var longNumber = 0; longNumber < this.longitudeBands; longNumber++) {
                  var first = (latNumber * (this.longitudeBands + 1)) + longNumber;
                  var second = first + this.longitudeBands + 1;
                  arrays.idx.data.push(first);
                  arrays.idx.data.push(second);
                  arrays.idx.data.push(first + 1);
              
                  arrays.idx.data.push(second);
                  arrays.idx.data.push(second + 1);
                  arrays.idx.data.push(first + 1);
                }
              }  
              
             console.log(arrays.idx);
              //console.log(arrays.idx); 
            buffers = twgl.createBufferInfoFromArrays(drawingState.gl, arrays);
        }
        if(!this.texture) {
            this.texture = twgl.createTexture(gl, {
                src : this.texture_input ,
                crossOrigin: "anonymous",
            });
        }
        // call init for each subobject
    };
    Sphere.prototype.draw = function(drawingState) {
        var modelM = twgl.m4.scaling([this.size, this.size, this.size]);
        twgl.m4.setTranslation(modelM, this.position, modelM);
        var gl = drawingState.gl;
        gl.useProgram(shaderProgram.program);
        twgl.setBuffersAndAttributes(gl, shaderProgram, buffers);
        twgl.setUniforms(shaderProgram, {
            view: drawingState.view,
            proj: drawingState.proj,
            lightdir: drawingState.sunDirection,
            cubecolor: [1.0,1.0,1.0],
            model: modelM,
            texSampler: this.texture 
        });
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
        // transform objects and draw
    };
    Sphere.prototype.center = function(drawingState) {
        return this.position;
    }

})();

// put some objects into the scene
// normally, this would happen in a "scene description" file
// but I am putting it here, so that if you want to get
// rid of cubes, just don't load this file.
grobjects.push(new Sphere("sphere1", [0,7,0], 1, LoadedImageFiles["universe.png"].src));
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
