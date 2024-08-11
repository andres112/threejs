import * as THREE from 'three';
import { parameters, DISTANCE_BETWEEN_MESHES } from './app';

let particlesGeometry = new THREE.BufferGeometry();
let particlesMaterial = new THREE.PointsMaterial();

export const createParticles = (isUpdate = false): THREE.Points => {
  // If points already exist, remove them
  if (isUpdate) {
    particlesGeometry?.dispose();
    particlesMaterial?.dispose();
  }
  const positions = new Float32Array(parameters.particlesCount * 3);
  const colors = new Float32Array(parameters.particlesCount * 3);
  const colorParticles = new THREE.Color(parameters.materialColor);

  const particleTexture = new THREE.TextureLoader().load('/textures/particles/3.png');

  for (let i = 0; i < parameters.particlesCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 10;
    positions[i3 + 1] = DISTANCE_BETWEEN_MESHES * 0.5 - Math.random() * DISTANCE_BETWEEN_MESHES * 4;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;

    colors[i3] = colorParticles.r;
    colors[i3 + 1] = colorParticles.g;
    colors[i3 + 2] = colorParticles.b;
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  particlesMaterial.size = 0.05;
  particlesMaterial.sizeAttenuation = true;
  particlesMaterial.alphaMap = particleTexture;
  particlesMaterial.transparent = true;
  particlesMaterial.depthWrite = false;
  particlesMaterial.blending = THREE.AdditiveBlending;
  particlesMaterial.vertexColors = true;

  return new THREE.Points(particlesGeometry, particlesMaterial);
};
