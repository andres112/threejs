uniform mat4 projectionMatrix;// transform the 3D space into 2D space (clip space)
uniform mat4 viewMatrix; // Apply transformations to the Camera (rotation, translation, field of view, near/far)
uniform mat4 modelMatrix; // Apply transformations to the Mesh (scale, rotation, translation)
// uniform mat4 modelViewMatrix; // modelMatrix * viewMatrix

// Custom uniforms defined in the JS
uniform vec2 uFrequency;
uniform float uTime;

// Attributes which are passed from the JS
attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
attribute float aRandom;

// Varyings are passed to the fragment shader
varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
    // gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);

    // The above is the same as the following, just more readable
    vec4  modelPosition = modelMatrix * vec4(position, 1.0);

    float elevation = sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    elevation += sin(modelPosition.y * uFrequency.y - uTime) * 0.1;
    modelPosition.z += elevation;

    // modelPosition.z += aRandom * 0.1;

    vec4  viewPosition = viewMatrix * modelPosition;
    vec4  projectionPosition = projectionMatrix * viewPosition;
    // projectionPosition.y += sin(projectionPosition.x * 2.0) * 0.5;
    gl_Position = projectionPosition;

    // The following is possible but NOT recommended
    // gl_Position.y += 0.5;
    // gl_Position.x += 0.5;

    vRandom = aRandom;
    vUv = uv;
    vElevation = elevation;
}
