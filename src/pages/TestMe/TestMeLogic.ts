class TestMeLogic {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D | null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
  }

  initialize() {
    console.log("hello initialize");
  }

  start() {
    const gl = this.canvas.getContext("webgl2");

    const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

    // Fragment shader program
    const fsSource = `
    void main(void) {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

    if (!gl) {
      console.error("WebGL2 is not supported", gl);
      return;
    }

    // Define the geometry of the box
    const vertices = [
      -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0, -1.0,
      -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,
    ];

    const indices = [
      0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 0, 4, 7, 0, 7, 3, 1, 5, 6, 1, 6, 2, 0,
      1, 5, 0, 5, 4, 2, 3, 7, 2, 7, 6,
    ];

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW
    );

    // Compile shaders
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    const shaderProgram = gl.createProgram();
    if (!shaderProgram) return;
    gl.attachShader(shaderProgram, vs);
    gl.attachShader(shaderProgram, fs);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Specify the attribute and uniform locations
    const vertexPosition = gl.getAttribLocation(
      shaderProgram,
      "aVertexPosition"
    );
    const modelViewMatrix = gl.getUniformLocation(
      shaderProgram,
      "uModelViewMatrix"
    );
    const projectionMatrix = gl.getUniformLocation(
      shaderProgram,
      "uProjectionMatrix"
    );

    // Set up perspective matrix
    const fieldOfView = (45 * Math.PI) / 180;
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrixValue = mat4.create();
    mat4.perspective(projectionMatrixValue, fieldOfView, aspect, zNear, zFar);

    gl.uniformMatrix4fv(projectionMatrix, false, projectionMatrixValue);

    // Set up model-view matrix
    const modelViewMatrixValue = mat4.create();
    mat4.translate(
      modelViewMatrixValue,
      modelViewMatrixValue,
      [-0.0, 0.0, -6.0]
    );

    // Main rendering loop
    function drawScene() {
      if (!gl) {
        console.error("WebGL2 is not supported");
        return;
      }
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      // Bind position buffer and specify the vertex attributes
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(vertexPosition);

      // Set the model-view matrix
      gl.uniformMatrix4fv(modelViewMatrix, false, modelViewMatrixValue);

      // Draw the box
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(drawScene);
    }

    drawScene();
  }
}

export default TestMeLogic;
