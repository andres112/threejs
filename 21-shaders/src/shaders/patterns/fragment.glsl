uniform int uPatternIndex;
varying vec2 vUv;

// https://thebookofshaders.com/10/
// Random number generator. Not exist in glsl a random function, so we use a pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)) * 43758.5453123));
}

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
    // Pattern 11: Dots
    else if(uPatternIndex == 10) {
        strength = step(0.8, mod(vUv.x * 10.0, 1.0));
        strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 12: Dashes
    else if(uPatternIndex == 11) {
        strength = step(0.4, mod(vUv.x * 10.0, 1.0));
        strength *= step(0.8, mod(vUv.y * 10.0, 1.0));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 13: Corners
    else if(uPatternIndex == 12) {
        float horizontal = step(0.4, mod(vUv.x * 10.0, 1.0));
        horizontal *= step(0.8, mod(vUv.y * 10.0, 1.0));

        float vertical = step(0.8, mod(vUv.x * 10.0, 1.0));
        vertical *= step(0.4, mod(vUv.y * 10.0, 1.0));

        strength = horizontal + vertical;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 14: Crosses
    else if(uPatternIndex == 13) {
        float horizontal = step(0.4, mod(vUv.x * 10.0, 1.0));
        horizontal *= step(0.8, mod(vUv.y * 10.0 + 0.2, 1.0)); // + 0.2 to move the cross

        float vertical = step(0.8, mod(vUv.x * 10.0 + 0.2, 1.0)); // + 0.2 to move the cross
        vertical *= step(0.4, mod(vUv.y * 10.0, 1.0));

        strength = horizontal + vertical;

        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 15: Gradient from center to right and left
    else if(uPatternIndex == 14) {
        strength = abs(vUv.x - 0.5);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 16: Minimum abs from center
    else if(uPatternIndex == 15) {
        strength = min(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
        gl_FragColor = vec4(vec3(strength), 1.0);
    } 
    // Pattern 17: Max abs from center
    else if(uPatternIndex == 16) {
        strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));
        gl_FragColor = vec4(vec3(strength), 1.0);
    } 
    // Pattern 18: Frames
    else if(uPatternIndex == 17) {
        // max limit is 0.5 due to the UV coordinates were shifted to the center
        strength = step(0.4, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 19: Vertical gradient chart
    else if(uPatternIndex == 18) {
        strength = floor(vUv.x * 10.0) / 10.0;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    //Pattern 20: Grid gradient chart
    else if(uPatternIndex == 19) {
        strength = floor(vUv.x * 10.0) / 10.0;
        strength *= floor(vUv.y * 10.0) / 10.0;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 21: tv static
    else if(uPatternIndex == 20) {
        // slsl does not have a random function, so we use a pseudo-random function
        strength = random(vUv);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 22: bigger tv static
    else if(uPatternIndex == 21) {
        vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
        strength = random(gridUv);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 23: bigger tv static diagonal
    else if(uPatternIndex == 22) {
        vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x * 0.5) * 10.0) / 10.0);
        strength = random(gridUv);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 24: White with black corner
    else if(uPatternIndex == 23){
        strength = length(vUv);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 25: White with black center
    else if(uPatternIndex == 24){
        // With length
        // strength = length(vUv - 0.5);
        // or with distance
        strength = distance(vUv, vec2(0.5, 0.5));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 26: White with white circle center
    else if(uPatternIndex == 25){
        strength = 1.0 - distance(vUv, vec2(0.5, 0.5));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 27: Black with white small point center
    else if(uPatternIndex == 26){
        strength = 0.02 / distance(vUv, vec2(0.5, 0.5));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 28: Black with white small oval center
    else if(uPatternIndex == 27){
        // oval point: modify the x coordinate to make it oval
        // and the y coordinate to move it to the center
        vec2 ovalPoint = vec2(
            vUv.x, 
            (vUv.y - 0.5) * 5.0 + 0.5
        );
        strength = 0.2 / distance(ovalPoint, vec2(0.5, 0.5) );
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 29: Black with white start in center
    else if(uPatternIndex == 28){
        vec2 lightUvX = vec2(
            vUv.x, 
            (vUv.y - 0.5) * 5.0 + 0.5
        );
        float lightX = 0.2 / distance(lightUvX, vec2(0.5, 0.5));
        vec2 lightUvY = vec2(
            (vUv.x - 0.5) * 5.0 + 0.5, 
            vUv.y
        );
        float lightY = 0.2 / distance(lightUvY, vec2(0.5, 0.5));

        strength = lightX * lightY;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
}
