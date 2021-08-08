import "./style.css";
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import gsap from "gsap";

// const gui = new dat.GUI();
const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const gltfLoader = new GLTFLoader();

// Cursor
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = -(e.clientY / sizes.height - 0.5);

  //   console.log(cursor);
});

gltfLoader.load("/models/Databar/databar-medium.glb", (gltf) => {
  gltf.scene.scale.set(0.09, 0.09, 0.09);
  gltf.scene.position.set(0, -0.3, 0);
  gltf.scene.rotateX(0.96);
  gltf.scene.rotateY(0.785398);
  console.log(gltf.scene);
  scene.add(gltf.scene);
});

// const material = new THREE.MeshBasicMaterial({ wireframe: true });
// material.metalness = 0.45;
// material.roughness = 0.65;

// gui.add(material, "metalness").min(0).max(1).step(0.0001);
// gui.add(material, "roughness").min(0).max(1).step(0.0001);

// const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1, 3, 3, 3), material);
// box.rotateX(0.96);
// box.rotateY(0.785398);
// box.position.x = 0;
// box.position.y = 0;
// box.position.z = 0;

// gui.add(box.position, "x", -10, 10, 0.01);
// gui.add(box.position, "y", 0, 10, 0.01);
// gui.add(box.position, "z", 0, 10, 0.01);

// gui.add(box.rotation, "x", 0, Math.PI / 2, 0.001);
// gui.add(box.rotation, "y", 0, Math.PI / 2, 0.001);
// gui.add(box.rotation, "z", 0, Math.PI * 2, 0.01);

// scene.add(box);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const aspectRatio = sizes.width / sizes.height;
const camera = new THREE.OrthographicCamera(-1 * aspectRatio, 1 * aspectRatio, 1, -1, 0.01, 10);
camera.rotation.x = 0;
camera.position.y = -0.357;
camera.position.z = 1;
// camera.zoom = 0.5;
camera.updateMatrix();
scene.add(camera);

// const helper = new THREE.CameraHelper(camera);
// scene.add(helper);

const controls = new OrbitControls(camera, canvas);
controls.rotateSpeed = 2;
// controls.noPan = true;
// controls.noZoom = true;
controls.enableDamping = true;
controls.update();
// controls.maxPolarAngle = Math.PI / 8;

controls.addEventListener("start", () => {
  gsap.killTweensOf(camera.position);
  controls.update();
});

const vx = {
  one: new THREE.Vector3(0, -0.357, 1),
  two: new THREE.Vector3(0.825, 0.337, 0.476),
  three: new THREE.Vector3(0.825, -0.337, -0.476),
  four: new THREE.Vector3(0, 0.357, -1),
  five: new THREE.Vector3(-0.816, -0.327, -0.475),
  six: new THREE.Vector3(-0.816, 0.327, 0.475),
};

controls.addEventListener("end", () => {
  // console.log("end");
  setTimeout(() => {
    const cameraPosition = camera.position;
    const closest = Object.keys(vx).reduce(function (prev, curr) {
      return cameraPosition.distanceTo(vx[prev]) < cameraPosition.distanceTo(vx[curr])
        ? prev
        : curr;
    });

    console.log("closest", closest);
    const closestVx = vx[closest];
    gsap.to(camera.position, {
      duration: 2,
      x: closestVx.x,
      y: closestVx.y,
      z: closestVx.z,
    });
    controls.update();
  }, 750);
});

// gui.add(camera.position, "x", -5, 5, 0.1);
// gui.add(camera.position, "y", -5, 5, 0.001);
// gui.add(camera.position, "z", -5, 5, 0.1);

// gui.add(camera.rotation, "x", 0, Math.PI / 2, 0.001);
// gui.add(camera.rotation, "y", 0, Math.PI / 2, 0.001);
// gui.add(camera.rotation, "z", 0, Math.PI * 2, 0.01);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

const ambientLight = new THREE.AmbientLight("white", 1);
scene.add(ambientLight);

const directionalLightOne = new THREE.DirectionalLight(0xffffff, 2);
directionalLightOne.position.set(0, 1, 0);
const directionalLightTwo = new THREE.DirectionalLight(0xffffff, 2);
directionalLightTwo.position.set(0, 0, 1);
const directionalLightThree = new THREE.DirectionalLight(0xffffff, 2);
directionalLightThree.position.set(1, 0, 0);
scene.add(directionalLightOne, directionalLightTwo, directionalLightThree);

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */

function checkRotation() {
  const rotationSpeed = 0.0025;
  var x = camera.position.x,
    y = camera.position.y,
    z = camera.position.z;

  camera.position.x = x * Math.cos(rotationSpeed) + z * Math.sin(rotationSpeed);
  camera.position.z = z * Math.cos(rotationSpeed) - x * Math.sin(rotationSpeed);
  camera.position.y = -0.337;

  camera.lookAt(scene.position);
}

const clock = new THREE.Clock();

camera.position.x = 0;
// camera.position.y = 0.35;
// camera.position.z = 1;
// console.log(camera.position);
let prevPosition = new THREE.Vector3();
let prevTime = 0;
let hasMoved = false;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // console.log(camera.rotation);

  // const mult = 10;
  // camera.position.x = -Math.cos(cursor.x * mult);
  // camera.position.z = Math.sin(cursor.x * mult);

  // // camera.position.z = Math.sin(cursor.y * mult);
  // camera.position.y = Math.cos(cursor.y * mult);
  // // camera.position.z = -Math.sin(cursor.x * mult) + Math.sin(cursor.y * mult);

  // console.log(camera.position);

  // camera.position.x = cursor.x * mult;
  // camera.position.z = -(Math.sin(cursor.x * Math.PI * 5) );
  // camera.position.y = -0.97;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // camera.lookAt(scene.position);

  // checkRotation();
  // camera.lookAt(box.position);

  // Update Objects
  // sphere.rotation.y = 0.1 * elapsedTime;
  // plane.rotation.y = 0.1 * elapsedTime;
  // torus.rotation.y = 0.1 * elapsedTime;

  // sphere.rotation.x = 0.15 * elapsedTime;
  // plane.rotation.x = 0.15 * elapsedTime;
  // torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // console.log(camera.position);

  // const cur = camera.position;
  // console.log(camera.position, prev, cur.equals(prev));
  // prev = cur;
  // const curTime = parseInt(elapsedTime);
  // if (curTime > prevTime) {
  //   const currentPosition = camera.position;
  //   console.log(prevPosition, camera.position);

  //   prevPosition = new THREE.Vector3(currentPosition.x, currentPosition.y, currentPosition.z);
  //   prevTime = curTime;
  // }

  // =================================================================
  // const curTime = parseInt(elapsedTime);
  // console.log(hasMoved);
  // if (curTime > prevTime) {
  //   const currentPosition = camera.position;
  //   if (prevPosition.equals(camera.position)) {
  //     // console.log("stable");
  //     if (hasMoved) {
  //       gsap.to(camera.position, {
  //         duration: 2,
  //         x: -0.8215934346771245,
  //         y: 0.32694399941354896,
  //         z: 0.46700305067837533,
  //       });
  //       controls.update();
  //       hasMoved = false;
  //     }
  //   } else hasMoved = true;
  //   prevPosition = new THREE.Vector3(currentPosition.x, currentPosition.y, currentPosition.z);
  //   prevTime = curTime;
  // }
  // =================================================================

  // prevTime = curTime;

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
