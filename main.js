import './style.css';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import p5 from 'p5';
const { createVector } = p5.prototype;
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Perlin from './Perlin';

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const app = document.querySelector('#app');

const perlin = new Perlin();

/*
 * Scene
 */
const color = 'rgb(106,193,222)'; // white
const near = 10;
const far = 100;
const scene = new THREE.Scene();
scene.background = new THREE.Color(color);
// scene.fog = new THREE.Fog(color, near, far);

// const gltfLoader = new GLTFLoader();
// let model = null;
// let tree = new THREE.Object3D();
// const trees = [];

// gltfLoader.load('/models/palmtree.gltf', (gltf) => {
//   model = { ...gltf };
//   let mesh = model.scene.children[0];
//   tree.add(mesh);
//   generateTrees();
// });

/*
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20000
);

// Controls
const controls = new OrbitControls(camera, app);
controls.target.set(0, 0, 0);
controls.enableDamping = true;

/*
 * Mesh
 */
// const cube = new THREE.Mesh(geometry, material);

/*
 *  Lights
 */
const light = new THREE.DirectionalLight(0xffffff, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });

const floorGeom = new THREE.PlaneGeometry(2200, 2200, 256, 256);
floorGeom.dynamic = true;

const floorMaterial = new THREE.MeshStandardMaterial({
  vertexColors: true,
  color: new THREE.Color('white'),
  // wireframe: true,
});

const floor = new THREE.Mesh(floorGeom, floorMaterial);

function randomTerrain() {
  const vertices = floor.geometry.attributes.position.array;
  let count = floor.geometry.attributes.position.count;

  // console.log(count);

  const colors = [];
  const color = new THREE.Color('rgb(59,64,123)');

  for (let i = 0; i < vertices.length; i += 3) {
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
    colors.push(color.r, color.g, color.b);
  }

  floor.geometry.setAttribute(
    'color',
    new THREE.Float32BufferAttribute(colors, 3)
  );

  let peak = 200;
  let smoothing = 200;

  for (let i = 0; i <= vertices.length; i += 3) {
    const level =
      peak *
        perlin.noise(vertices[i] / smoothing, vertices[i + 1] / smoothing) || 0;
    vertices[i + 2] = level;
    if (level < -60) {
      colors[i] = 220 / 255; // red
      colors[i + 1] = 242 / 255; // green
      colors[i + 2] = 255 / 255; // blue
    }
    if (level > 30) {
      colors[i] = 255 / 255; // red
      colors[i + 1] = 189 / 255; // green
      colors[i + 2] = 89 / 255; // blue
    }
    if (level > 60) {
      colors[i] = 48 / 255; // red
      colors[i + 1] = 189 / 255; // green
      colors[i + 2] = 255 / 255; // blue
    }
  }

  floor.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3)
  );

  floor.geometry.attributes.position.needsUpdate = true;
  floor.geometry.attributes.color.needsUpdate = true;
  floor.geometry.computeVertexNormals();

  scene.add(floor);
}

/*
 * Setup
 */
function setup() {
  // camera
  camera.position.z = 1200;
  camera.position.y = 600;
  camera.rotation.x = -0.7;

  controls.update();
  scene.add(light);

  floor.position.y = 0;
  floor.material.side = THREE.DoubleSide;
  floor.rotation.x = Math.PI / 2.1;

  // renderer
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  renderer.setSize(window.innerWidth, window.innerHeight);
  app.appendChild(renderer.domElement);

  randomTerrain();

  renderer.render(scene, camera);
  // initKeyControls();
}

/*
 * "Game" Loop
 */
function draw() {
  // randomTerrain();
  renderer.render(scene, camera);

  requestAnimationFrame(draw);
}

setup();
draw();
