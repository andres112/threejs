#include "perlin_noise.glsl"

uniform float uBigWavesElevation;
uniform vec2 uBigWavesFrequency;
uniform float uTime;
uniform float uBigWavesSpeed;
uniform float uSmallWavesSpeed;
uniform float uSmallWavesFrequency;
uniform float uSmallWavesElevation;
uniform float uSmallWavesIterations;

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

    for(float i = 1.0; i <= uSmallWavesIterations; i++) {
        // use of negative abs to make a peak effect in the perlin noise
        // i could be used as a frequency modifier and as elevation of the wave
        // uTime reduced to make the effect slower
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
    }

    modelPosition.y += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    // Varying
    vElevation = elevation;

}
