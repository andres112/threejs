precision mediump float;

// Varyings are passed from the vertex shader
varying float vRandom;
varying vec2 vUv;
varying float vElevation;

// Custom uniforms defined in the JS
uniform vec3 uColor;
uniform sampler2D uTexture;

void main() {
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.8;
    // gl_FragColor = vec4(1.0, vRandom, 0.2, 1.0);
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}