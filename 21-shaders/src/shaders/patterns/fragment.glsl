uniform int uPatternIndex;
varying vec2 vUv;

void main() {
    // NOTE: Use of if conditionals is not recommended in shaders. BAD PERFORMANCE!
    float strength = vUv.x;
    // Pattern 1: Gradient from bottom-left to top-right blue to white
    if(uPatternIndex == 0) {
        gl_FragColor = vec4(vUv, 1.0, 1.0); // is the same as gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);
    }
    // Pattern 2: Gradient from bottom-left to top-right red to green
    else if(uPatternIndex == 1) {
        gl_FragColor = vec4(vUv, 0.0, 1.0);
    }
    // Pattern 3: Gradient from left to right black to white
    else if(uPatternIndex == 2) {
        gl_FragColor = vec4(vec3(strength), 1.0); // is the same as gl_FragColor = vec4(strength, strength, strength, 1.0);
    }
    // Pattern 4: Gradient from bottom to top black to white
    else if(uPatternIndex == 3) {
        strength = vUv.y;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 5: Gradient from top to bottom black to white
    else if(uPatternIndex == 4) {
        strength = 1.0 - vUv.y;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 6: Gradient from bottom to top black to white with acceleration
    else if(uPatternIndex == 5) {
        strength = vUv.y * 10.0; // accelerate the gradient
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 7: Horizontal stripes
    else if(uPatternIndex == 6) {
        strength = mod(vUv.y * 10.0, 1.0);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 8: Horizontal stripes more dense
    else if(uPatternIndex == 7) {
        strength = mod(vUv.y * 10.0, 1.0); // example: 0.5 * 10.0 = 5.0, 5.0 % 1.0 = 0.0
        strength = step(0.5, strength); //is the same as strength = strength < 0.5 ? 0.0 : 1.0; BEST PERFORMANCE!
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 9: Vertical stripes less dense
    else if(uPatternIndex == 8) {
        strength = mod(vUv.x * 10.0, 1.0); // example: 0.08 * 10.0 = 0.8, 0.8 % 1.0 = 0.8
        strength = step(0.75, strength);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 10: Grid
    else if(uPatternIndex == 9) {
        strength = step(0.8, mod(vUv.x * 10.0, 1.0));
        strength += step(0.8, mod(vUv.y * 10.0, 1.0));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
}
