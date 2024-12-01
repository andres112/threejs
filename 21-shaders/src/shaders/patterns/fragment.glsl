uniform int uPatternIndex;
varying vec2 vUv;

// https://thebookofshaders.com/10/
// Random number generator. Not exist in glsl a random function, so we use a pseudo-random function
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233)) * 43758.5453123));
}

// Rotation function. Not exist, therefore is required to create it.
vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    return vec2(
        cos(rotation) * (uv.x - mid.x) - sin(rotation) * (uv.y - mid.y) + mid.x,
        sin(rotation) * (uv.x - mid.x) + cos(rotation) * (uv.y - mid.y) + mid.y
    );
}

//	Classic Perlin 2D Noise 
//	by Stefan Gustavson (https://github.com/stegu/webgl-noise)
//
vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Const in glsl
#define PI 3.1415926535897932384626433832795

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
    // Pattern 29: Black with white cross in center
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
    // Pattern 30: Black with white rotated cross in center
    else if(uPatternIndex == 29){
        vec2 rotatedUv = rotate(vUv, PI * 0.25, vec2(0.5));
        vec2 lightUvX = vec2(
            rotatedUv.x, 
            (rotatedUv.y - 0.5) * 5.0 + 0.5
        );
        float lightX = 0.2 / distance(lightUvX, vec2(0.5, 0.5));
        vec2 lightUvY = vec2(
            (rotatedUv.x - 0.5) * 5.0 + 0.5, 
            rotatedUv.y
        );
        float lightY = 0.2 / distance(lightUvY, vec2(0.5, 0.5));

        strength = lightX * lightY;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 31: White with black circle in center
    else if(uPatternIndex == 30){
        strength = step(0.25, distance(vUv, vec2(0.5, 0.5)));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 32: black ring with gradient
    else if(uPatternIndex == 31){
        strength = abs(distance(vUv, vec2(0.5, 0.5)) - 0.25);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 33: black ring with white background
    else if(uPatternIndex == 32){
        strength = step(0.01, abs(distance(vUv, vec2(0.5, 0.5)) - 0.25));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 34: white ring with black background
    else if(uPatternIndex == 33){
        strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5, 0.5)) - 0.25));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 35: Waved ring shape pattern
    else if(uPatternIndex == 34){
        vec2 wavedUv = vec2(
            vUv.x,
            vUv.y + sin(vUv.x * 40.0) * 0.1
        );
        strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5, 0.5)) - 0.25));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 36: waved ring both axes, varying amplitudes
    else if(uPatternIndex == 35){
        vec2 wavedUv = vec2(
            vUv.x + sin(vUv.y * 100.0) * 0.1,
            vUv.y + sin(vUv.x * 30.0) * 0.1
        );
        strength = 1.0 - step(0.01, abs(distance(wavedUv, vec2(0.5, 0.5)) - 0.25));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 37: diagonal generated by arc tangent
     else if(uPatternIndex == 36) {
        strength = atan(vUv.x, vUv.y);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 38: diagonal generated by arc tangent with offset
     else if(uPatternIndex == 37) {
        strength = atan(vUv.x - 0.5, vUv.y - 0.5);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 39: diagonal generated by arc tangent with offset and 360° rotation
     else if(uPatternIndex == 38) {
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= 2.0 * PI;
        angle += 0.5;
        strength = angle;
        // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 40: startbust pattern
     else if(uPatternIndex == 39) {
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5);
        angle /= 2.0 * PI;
        angle += 0.5;
        angle = mod(angle * 25.0, 1.0);
        strength = angle;
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 41: Sun pattern
     else if(uPatternIndex == 40) {
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
        strength = sin(angle * 100.0);
        gl_FragColor = vec4(vec3(strength) * vec3(1.0, 1.0, 0.0), 1.0); // * vec3(1.0, 1.0, 0.0) color yellow
    }
    // Pattern 42: ameba pattern
    else if(uPatternIndex == 41) {
        float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
        float sinusoid = sin(angle * 100.0);
        float radius = 0.25 + sinusoid * 0.02;
        strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5, 0.5)) - radius));
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
    // Pattern 43: Perlin noise
    else if(uPatternIndex == 42){
        // use of cnoise function to generate perlin noise
        strength = cnoise(vUv * 10.0);
        gl_FragColor = vec4(vec3(strength), 1.0);
    }
}
