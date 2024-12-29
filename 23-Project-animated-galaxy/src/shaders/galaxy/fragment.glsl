void main() {

    // Disc pattern
    // distance from the point to the center of the quad
    // float strength = distance(gl_PointCoord, vec2(0.5));
    // strength = step(0.5, strength);
    // strength = 1.0 - strength;

    // Diffuse point pattern
    float strength = distance(gl_PointCoord, vec2(0.5));
    strength *= 2.0;
    strength = 1.0 - strength;

    gl_FragColor = vec4(vec3(strength), 1.0);
    #include <colorspace_fragment>
}