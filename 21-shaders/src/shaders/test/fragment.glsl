precision mediump float;

varying float vRandom;

// Custom uniforms defined in the JS
uniform vec3 uColor;

void main() {
    // gl_FragColor = vec4(1.0, vRandom, 0.2, 1.0);
    gl_FragColor = vec4(uColor, 1.0);
}