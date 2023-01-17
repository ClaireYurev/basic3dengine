const vertexShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: vert

in float aPointSize;
in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main()
{
    vColor = aColor;
    gl_PointSize = aPointSize;
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `#version 300 es
#pragma vscode_glsllint_stage: frag

precision mediump float;

in vec3 vColor;

out vec4 fragColor;

void main()
{
    fragColor = vec4(vColor, 1.0);
}

`;

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const program = gl.createProgram();

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);
gl.attachShader(program, vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader) + 'link failed');
    console.log(gl.getShaderInfoLog(fragmentShader) + 'link failed');
}

gl.useProgram(program);

const bufferData = new Float32Array([
     0,    1,        100,      1,0,0,
    -1,   -1,         32,      0,1,0,
     1,   -1,         50,      0,0,1,
]);

const aPositionLocation = gl.getAttribLocation(program, 'aPosition');
const aPointSizeLocation = gl.getAttribLocation(program, 'aPointSize');
const aColorLocation = gl.getAttribLocation(program, 'aColor');

console.log(aPositionLocation, aPointSizeLocation, aColorLocation);

gl.enableVertexAttribArray(aPositionLocation);
gl.enableVertexAttribArray(aPointSizeLocation);
gl.enableVertexAttribArray(aColorLocation);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, 6 * 4, 0);
gl.vertexAttribPointer(aPointSizeLocation, 1, gl.FLOAT, false, 6 * 4, 2 * 4);
gl.vertexAttribPointer(aColorLocation, 3, gl.FLOAT, false, 6 * 4, 3 * 4);

gl.drawArrays(gl.POINTS, 0 , 3);  // Three boxes with a single draw() call
