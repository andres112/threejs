uniform float uBigWavesElevation;

void main() {
    // matrices are provided by shadowMapMaterial
    // modelMatrix
    // viewMatrix
    // projectionMatrix

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Elevation
    float elevation = sin(modelPosition.x * 0.1 ) * uBigWavesElevation;
    modelPosition.z += elevation;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}