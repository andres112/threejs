#include "perlin_noise.glsl"

uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uTime;
uniform float uBigWavesSpeed;

// data to be passed to fragment shader
varying float vElevation;

void main() {
    // matrices are provided by shadowMapMaterial
    // modelMatrix
    // viewMatrix
    // projectionMatrix

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float elevation = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
        sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed) *
        uBigWavesElevation;
    elevation += cnoise(vec3(modelPosition.xz * 2.0, uTime * 0.1));

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varying
    vElevation = elevation;

}
