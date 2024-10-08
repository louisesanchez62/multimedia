import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.fog = new THREE.Fog( 0x555555, 10, 15 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 1, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/Label-Rouge_image_full.png');


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
cube.position.set(2, 0.5, 0);
scene.add(cube);

const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x555555 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -1;
scene.add(floor);

const loader = new GLTFLoader();
let ironMan;

loader.load('models/ImageToStl.com_jzb865er6v-ironman.glb', (gltf) => {
    const ironMan = gltf.scene;
    ironMan.scale.set(0.02, 0.02, 0.02);
    scene.add(ironMan);
});

function animateIronMan() {
  requestAnimationFrame(animateIronMan);

  if (ironMan) {
      ironMan.rotation.y = deviceRotation.alpha;
      ironMan.rotation.x = deviceRotation.beta;
  }

  renderer.render(scene, camera);
}

animateIronMan();

function animateCube() {
    requestAnimationFrame(animateCube);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animateCube();

const rainCount = 10000; 
const rainGeometry = new THREE.BufferGeometry();

const positions = new Float32Array(rainCount * 3); 

for (let i = 0; i < rainCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200; 
    positions[i * 3 + 1] = Math.random() * 200; 
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200;
}

rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const rainMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.2,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7
});

const rainParticles = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rainParticles);

function animateRain() {
  requestAnimationFrame(animateRain);

  if (ironMan) {
    ironMan.rotation.y += 0.01;
  }

  rainParticles.geometry.attributes.position.array.forEach((_, index) => {
    if (index % 3 === 1) { 
      rainParticles.geometry.attributes.position.array[index] -= 2;
      if (rainParticles.geometry.attributes.position.array[index] < -100) {
        rainParticles.geometry.attributes.position.array[index] = Math.random() * 200;
      }
    }
  });

  rainParticles.geometry.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
}

animateRain();

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; 
controls.dampingFactor = 0.25; 

function animateView() {
    requestAnimationFrame(animateView);
    controls.update();

    if (ironMan) {
        ironMan.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}

animateView();

// Ajuster taille renderer si la fenetre est redimensionnee
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});