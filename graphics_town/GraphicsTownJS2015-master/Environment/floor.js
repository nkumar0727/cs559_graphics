
/**
 * Created by Nikhil Kumar.
 */

var grobjects = grobjects || [];

var planeSz = planeSz || 10;
var centerSz = centerSz || 5;

(function() {
    "use strict";

  var vertexPos = [
    -1,0,-1,   -1,0,1,   -0.75,0,1,     // leftmost grass section
    -0.75,0,1,   -1,0,-1,   -0.75,0,-1,
    0.75,0,-1,   0.75,0,1,   1,0,1,     // rightmost grass section
    1,0,1,   0.75,0,-1,   1,0,-1,
    0.75,0,-1,   -0.75,0,-1,   -0.75,0,-0.75,   // topmost grass section
    -0.75,0,-0.75,   0.75,0,-1,   0.75,0,-0.75,
    0.75,0,0.75,   -0.75,0,0.75,   -0.75,0,1,   // bottommost grass section
    -0.75,0,1,   0.75,0,0.75,   0.75,0,1,
    -0.5,0,-0.5,   -0.5,0,0.5,   0.5,0,0.5,    // inside tile section
    0.5,0,0.5,   -0.5,0,-0.5,   0.5,0,-0.5,
    // do road section...
    // do square grass section...
    /*
    -1, 0, -1, -1, 0, 1, 1, 0, 1, // black street
    1, 0, 1, 1, 0, -1, -1, 0, -1,
    */
  ];
  var vertexTex = [
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   0,1,   1,1,
    0,0,   1,0,   1,1,
    1,1,   0,0,   0,1,
  ];
  var vertexNorm = [
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
    0,1,0,   0,1,0,   0,1,0,
  ];

  var grassTexture = undefined;
  var tileTexture = undefined;
  var dirtTexture = undefined;

  var shaderProgram = undefined;
  var buffers = undefined;

  var floor = {
    name : "Floor Plane",
    init : function(drawingState) {
      var gl = drawingState.gl;
      if (!shaderProgram) {
        shaderProgram = twgl.createProgramInfo(gl,["floor-vs","floor-fs"]);
      }
      var arrays = {
        vpos : {
          numComponents:3,
          data:vertexPos
        },
        vnormal : {
          numComponents:3,
          data:vertexNorm
        },
        vtex : {
          numComponents:2,
          data:vertexTex
        }
      };
      if(!grassTexture) {
        grassTexture = twgl.createTexture(gl, {
          src : LoadedImageFiles["grass.png"].src,
          crossOrigin: "anonymous",
        });
      }
      if(!tileTexture) {
        tileTexture = twgl.createTexture(gl, {
          src : LoadedImageFiles["tile.jpg"].src,
          crossOrigin: "anonymous",
        });
      }
      if(!dirtTexture) {
        dirtTexture = twgl.createTexture(gl, {
          src : LoadedImageFiles["dirt.jpg"].src,
          crossOrigin: "anonymous",
        });
      }
      buffers = twgl.createBufferInfoFromArrays(gl,arrays);
   },
    draw : function(drawingState) {
      var modelM = twgl.m4.scaling([planeSz, planeSz, planeSz]);
      var gl = drawingState.gl;
      gl.useProgram(shaderProgram.program);
      twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
      twgl.setUniforms(shaderProgram,{
        view:drawingState.view,
        proj:drawingState.proj,
        light:drawingState.sunDirection,
        model: modelM,
        texSamplerGrass: grassTexture,
        texSamplerTile: tileTexture,
        texSamplerDirt: dirtTexture
      });
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, grassTexture);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, tileTexture);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, dirtTexture);
      twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    },
    center : function(drawingState) {
      return [0,0,0];
    }

  };

  grobjects.push(floor);
})();
