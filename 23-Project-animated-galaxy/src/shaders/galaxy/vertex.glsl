uniform float uSize;
uniform float uTime;

attribute float aScale;
attribute vec3 aRandomness;

// The color is already defined as attribute in ShaderMaterial
// when is used vertexColors: true in the material
// pass as varying to fragment shader
varying vec3 vColor;

void main() {
    /**
    * Position
    */
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Modify the position based on the time
    // generate a spiral effect in x and z axis
    // 1. get the angle
    float angle = atan(modelPosition.x, modelPosition.z);
    // 2. get the distance from the center
    float distanceToCenter = length(modelPosition.xz);
    // 3. calculate offset angle
    float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
    angle += angleOffset;
    // 4. calculate the new position
    modelPosition.x = cos(angle) * distanceToCenter;
    modelPosition.z = sin(angle) * distanceToCenter;

    // Add randomness to the position
    modelPosition.xyz += aRandomness;

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