uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main(){

    float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 finalColor = mix(uDepthColor, uSurfaceColor, mixStrength);

    gl_FragColor = vec4(finalColor, 1.0);
    #include <colorspace_fragment>
}