uniform float uSize;

attribute float aScale;

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
}