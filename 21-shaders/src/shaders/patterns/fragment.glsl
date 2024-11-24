uniform int uPatternIndex;
varying vec2 vUv;


void main()
{
    // if pattern is 0 
    if (uPatternIndex == 0) {
        gl_FragColor = vec4(vUv, 1.0, 1.0);
    }
    // if pattern is 1
    else if (uPatternIndex == 1) {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
}