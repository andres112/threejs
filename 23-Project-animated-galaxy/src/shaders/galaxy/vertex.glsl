uniform float uSize;

attribute float aScale;

// The color is already defined as attribute in ShaderMaterial
// when is used vertexColors: true in the material
// pass as varying to fragment shader
varying vec3 vColor;

void main() {
    /**
    * Position
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    /**
    * Size
    * https://docs.gl/el3/gl_PointSize
    */
    gl_PointSize = uSize * aScale;
    // From node_modules/three/src/renderers/shaders/points.glsl.js
    // gl_PointSize *= ( scale / - mvPosition.z );
    gl_PointSize *= (1.0 / -viewPosition.z); // allows size change based on distance to camera

    /**
    * Color
    */
    vColor = color;
}