import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

async function loadScriptsAndInitialize(message){
  const scripts = await import('../client.js');
  scripts.sendMessage(message);
}
loadScriptsAndInitialize();
const monkeyUrl = new URL('../assets/scene.glb', import.meta.url);
const dndModel = new URL('../assets/twinkle.glb', import.meta.url);
let dndmodel;


const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

export function setPlayer(position) {
  console.log("DAWSON:" + position[1]);
  dndmodel.position.x = position[1].x;
  dndmodel.position.y = position[1].y;
  dndmodel.position.z = position[1].z;
}



const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

renderer.setClearColor(0x33ccff);

const orbit = new OrbitControls(camera, renderer.domElement);

camera.position.set(10, 10, 10);
orbit.update();

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);


const geometryHelper = new THREE.ConeGeometry(20, 100, 3);
geometryHelper.translate(0, 50, 0);
geometryHelper.rotateX(Math.PI / 2);
geometryHelper.scale(0.005, 0.005, 0.005);
helper = new THREE.Mesh(geometryHelper, new THREE.MeshNormalMaterial());
scene.add(helper);

// Create a URL for the image path using the URL class
const imageUrl = new URL('../assets/skybox.jpg', import.meta.url).href;

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load(imageUrl);

// Create a blue material
const blueMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });

// Create a cube geometry
const cubeGeometry = new THREE.BoxGeometry();
cubeGeometry.scale(200, 200, 200);
// Create a mesh by combining the geometry and material
const cube = new THREE.Mesh(cubeGeometry, blueMaterial);
cube
// Add the cube to the scene
scene.add(cube);

const assetLoader = new GLTFLoader();

let mixer;
assetLoader.load(monkeyUrl.href, function(gltf) {
  const model = gltf.scene;
  model.rotateX = 0.2;
  scene.add(model);
  mixer = new THREE.AnimationMixer(model);
  const clips = gltf.animations;

  // Play a certain animation
  // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
  // const action = mixer.clipAction(clip);
  // action.play();

  // Play all animations at the same time
  clips.forEach(function(clip) {
    const action = mixer.clipAction(clip);
    action.play();
  });

}, undefined, function(error) {
  console.error(error);
});




assetLoader.load(dndModel.href, function(gltf) {

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color
  // Iterate through the model's children (meshes) and apply the material
  gltf.scene.traverse((child) => {
    if (child.isMesh) {
      child.material = material;
      child.scale.set(0.01, 0.01, 0.01);
    }
  });
  dndmodel = gltf.scene;
  dndmodel.rotateX = 0.2;
  scene.add(dndmodel);
  mixer = new THREE.AnimationMixer(dndmodel);
  const clips = gltf.animations;

  // Play a certain animation
  // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
  // const action = mixer.clipAction(clip);
  // action.play();

  // Play all animations at the same time
  clips.forEach(function(clip) {
    const action = mixer.clipAction(clip);
    action.play();
  });

}, undefined, function(error) {
  console.error(error);
});


const clock = new THREE.Clock();
function animate() {
  if (mixer)
    mixer.update(clock.getDelta());
  renderer.render(scene, camera);
}

function onPointerMove(event) {

  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);

  // See if the ray from the camera into the world hits one of our meshes
  const intersects = raycaster.intersectObjects(scene.children);

  // Toggle rotation bool for meshes that we clicked
  if (intersects.length > 0) {

    helper.position.set(0, 0, 0);
    helper.lookAt(0, 1, 0);
    
    helper.position.copy(intersects[0].point);
    if(event.type === 'dblclick'){
      loadScriptsAndInitialize(intersects[0].point);
    }
  }

}

renderer.setAnimationLoop(animate);

window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
let eventCounter = 0;

window.addEventListener('pointermove', (event) => {
  eventCounter++;

  // Check if it's the fifth event
  if (eventCounter % 2 === 0) {
    onPointerMove(event);
  }
});

window.addEventListener('dblclick', (event) => {
    onPointerMove(event);
  });

