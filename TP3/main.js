import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Couleur de fond gris foncé

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0x404040); // Lumière douce
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5).normalize();
scene.add(directionalLight);

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('textures/Label-Rouge_image_full.png');


const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({ map: texture });
const cube = new THREE.Mesh(geometry, material);
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
    ironMan.scale.set(0.1, 0.1, 0.1);
    scene.add(ironMan);
});

let deviceRotation = { alpha: 0, beta: 0 };

window.addEventListener('deviceorientation', (event) => {
  deviceRotation.alpha = event.alpha ? THREE.MathUtils.degToRad(event.alpha) : 0;
  deviceRotation.beta = event.beta ? THREE.MathUtils.degToRad(event.beta) : 0;
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

// Ajuster taille renderer si la fenetre est redimensionnee
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});