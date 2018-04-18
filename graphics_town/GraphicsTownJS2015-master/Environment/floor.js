
/**
 * Created by Nikhil Kumar.
 */

var grobjects = grobjects || [];

var planeSz = planeSz || 10;
var centerSz = centerSz || 5;

(function() {
    "use strict";

  var vertexPos = [
    -planeSz, 0, -planeSz, -planeSz, 0, planeSz, planeSz, 0, planeSz, // black street
    planeSz, 0, planeSz, planeSz, 0, -planeSz, -planeSz, 0, -planeSz,
  ];
  var vertexColor = [
    0,0,1, 0,0,1, 0,0,1, // black street
    0,0,1, 0,0,1, 0,0,1,
  ];

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
        }
      };
      buffers = twgl.createBufferInfoFromArrays(gl,arrays);
   },
    draw : function(drawingState) {
      var gl = drawingState.gl;
      gl.useProgram(shaderProgram.program);
      twgl.setBuffersAndAttributes(gl,shaderProgram,buffers);
      twgl.setUniforms(shaderProgram,{
        view:drawingState.view,
        proj:drawingState.proj,
        light:drawingState.sunDirection
      });
      twgl.drawBufferInfo(gl, gl.TRIANGLES, buffers);
    },
    center : function(drawingState) {
      return [0,0,0];
    }

  };

  grobjects.push(floor);
})();
