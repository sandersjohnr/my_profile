
// initialize stats module
// var stats = initStats();
var clock = new THREE.Clock();

// constants
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
var PIXEL_RATIO = window.devicePixelRatio;

// camera
var VIEW_ANGLE = 30;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;
var FOG_DEPTH = 240;
var CAMERA_DISTANCE = 60;

var SPOT_ANGLE = Math.PI / 8;
var SPOT_INTENSITY = 1.5;
var SPOT_DISTANCE = 1000;

var PANEL_Y = 10.5;
var SCENE_WIDTH = 90;

// initialize globals
var camera, cameraControls, scene, renderer, fog;
var panel_1, panel_2, panel_3, mirrorMesh, groundMirror, selectableObjects;
var spotOne, spotTwo, spotThree;
var Views = {};

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( PIXEL_RATIO );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x333333, 1.0);

  // scene
  scene = new THREE.Scene();
  // axes
  var axes = new THREE.AxisHelper(20);
  // scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
  camera.position.set(-CAMERA_DISTANCE, 20, SCENE_WIDTH / 3);

  // controls
  cameraControls = new THREE.FlyControls(camera);
  cameraControls.movementSpeed = 135;
  cameraControls.rollSpeed = Math.PI / 12;
  cameraControls.autoForward = false;
  cameraControls.dragToLook = true;
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
}

function fillScene() {

  // mirror
  var planeGeo = new THREE.PlaneBufferGeometry(200, 200, 1, 1);
  groundMirror = new THREE.Mirror( renderer, camera,
    { clipBias: 0.003,
      textureWidth: WIDTH,
      textureHeight: HEIGHT,
      color: 0x222222 } );
  mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );
  mirrorMesh.add(groundMirror);
  mirrorMesh.rotateX( -Math.PI/2 );
  mirrorMesh.position.set(50, 0, 50);
  scene.add(mirrorMesh);

  // panels
  var panelGeo = new THREE.PlaneBufferGeometry(18 * 1.6, 18, 1, 1);
  var panel_1 = createMesh(panelGeo, 'featur.png');
  var panel_2 = createMesh(panelGeo, 'hoodz.png');
  var panel_3 = createMesh(panelGeo, 'stretchme.png');

  panel_1.rotation.y = Math.PI / - 2 + Math.PI/8;
  panel_2.rotation.y = Math.PI / -2;
  panel_3.rotation.y = Math.PI / -2 - Math.PI/8;
  panel_1.position.x = 40;
  panel_2.position.x = 45;
  panel_3.position.x = 40;
  panel_1.position.y = PANEL_Y;
  panel_2.position.y = PANEL_Y;
  panel_3.position.y = PANEL_Y;
  panel_1.position.z = 0;
  panel_2.position.z = SCENE_WIDTH / 3;
  panel_3.position.z = 2 * SCENE_WIDTH / 3;

  scene.add(panel_1);
  scene.add(panel_2);
  scene.add(panel_3);


  selectableObjects = [ panel_1, panel_2, panel_3 ];

  // lights
  var mainLight = new THREE.PointLight(0xcccccc, 0.5, 250);
  mainLight.position.set(45, 20, 20);
  scene.add( mainLight );

  var ambiLight = new THREE.AmbientLight(0x333333)
  // scene.add(ambiLight)

  // lighting
  var spotOne = new THREE.SpotLight( 0xff0000 );
  spotOne.position.set(0, 0, panel_1.position.z + 20);
  spotOne.intensity = SPOT_INTENSITY;
  spotOne.distance = SPOT_DISTANCE;
  scene.add(spotOne);

  var spotTwo = new THREE.SpotLight( 0x0000ff );
  spotTwo.position.set(0, 0, panel_2.position.z);
  spotTwo.intensity = SPOT_INTENSITY;
  spotTwo.distance = SPOT_DISTANCE;
  scene.add(spotTwo);

  var spotThree = new THREE.SpotLight( 0x00ff00 );
  spotThree.position.set(0, 0, panel_3.position.z - 20);
  spotThree.intensity = SPOT_INTENSITY;
  spotThree.distance = SPOT_DISTANCE;
  scene.add(spotThree);

  spotOne.angle = SPOT_ANGLE;
  spotTwo.angle = SPOT_ANGLE;
  spotThree.angle = SPOT_ANGLE;

  SPOT_TARGET = panel_3;

  spotOne.target = panel_1;
  spotTwo.target = panel_2;
  spotThree.target = panel_3;

  camera.lookAt(panel_2.position);
  // scene.fog = new THREE.Fog( 0x000000, 1, FOG_DEPTH);


  /* INTERACTION CONTROLS --------------------------------------- */
  var projector = new THREE.Projector();
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  var mouseover = false;

  // when clicked, panel takes user to corresponding project page
  function onDocumentMouseDown(event) {
    event.preventDefault();

    // create raycaster and cast ray from camera through mouse coordinates
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
    mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    // the object the ray intersects is the clicked panel
    var intersects = raycaster.intersectObjects( selectableObjects );
    if (intersects.length > 0) {
      var selectedPanel = intersects[0].object;
      if (selectedPanel == panel_1) {
        // document.getElementById('featur').click();
      } else if (selectedPanel == panel_2) {
        cameraTween1.start();
        // document.getElementById('hoodz').click();
      } else if (selectedPanel == panel_3) {
        // document.getElementById('stretchme').click();
      }
    }
  };

  function onDocumentMouseMove(event) {
    event.preventDefault();

    // create ray for mouse hover
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
    mouse.y = - ( event.clientY / HEIGHT ) * 2 + 1;
    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( selectableObjects );

    if (intersects.length > 0) {
      $('body').css('cursor', 'pointer');
      var selectedPanel = intersects[0].object;

      // if not already mouse-ing over, then now we are
      if (!mouseover) {
        mouseover = true;

        // focus lighting on hovered-over panel
        if (selectedPanel == panel_1) {
          mainLight.target =
          spotOne.target =
          spotTwo.target =
          spotThree.target = panel_1;

        } else if (selectedPanel == panel_2) {
          mainLight.target =
          spotOne.target =
          spotTwo.target =
          spotThree.target = panel_2;

        } else if (selectedPanel == panel_3) {
          mainLight.target =
          spotOne.target =
          spotTwo.target =
          spotThree.target = panel_3;

        }
      }
    } else {
      mouseover = false;
      $('body').css('cursor', 'default');
    }
  };

}

function render() {
  //render the mirror
  THREEx.WindowResize(renderer, camera);
  groundMirror.render();
  renderer.render(scene, camera);

}
var step = 0;
function update() {
  step+=1;
  if (!(step % 120)) console.log(camera.position, camera.rotation);
  TWEEN.update();
  requestAnimationFrame( update );
  // stats.update();
  var delta = clock.getDelta();
  cameraControls.update(delta);
  render();
}

init();
fillScene();
// createAnimations();
update();

function createMesh(geom, imageFile) {
  var texture = THREE.ImageUtils.loadTexture('assets/images/' + imageFile);
  var mat = new THREE.MeshLambertMaterial();
  mat.map = texture;
  var mesh = new THREE.Mesh(geom, mat);
  return mesh;
}

function createAnimations() {
  cameraTween1 = new TWEEN.Tween(camera.position).to({ x: -10, z: 0 }, 1000);
  // cube1Tween = new TWEEN.Tween(cube1.position).to({ z:cube1.position.z + offset}, 1000);
  // cube2Tween = new TWEEN.Tween(cube2.position).to({ z:cube2.position.z + offset}, 1000);
  // cube3Tween = new TWEEN.Tween(cube3.position).to({ z:cube3.position.z + offset}, 1000);
  // cube4Tween = new TWEEN.Tween(cube4.position).to({ z:cube4.position.z + offset}, 1000);
}

function createCameraControls() {

  // cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
  // cameraControls.center.set(45, 12, 36);
  // cameraControls.maxDistance = 400;
  // cameraControls.minDistance = 10;
  // cameraControls.update();

}
// create variable controller
// var controls = new function() {
//   this.rotationSpeed = 0.02;
//   this.bouncingSpeed = 0.03;
//   this.addCube = function() {
//     var cubeSize = Math.ceil(Math.random() * 3);
//     var cube = new THREE.Mesh(
//       new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
//       new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff })
//     )
//     cube.position.x = -20 + Math.round(Math.random() * planeGeometry.parameters.width);
//     cube.position.y = Math.round(Math.random() * 5);
//     cube.position.z = -30 + Math.round(Math.random() * planeGeometry.parameters.height);
//     scene.add(cube);
//   };
//
// }
//
// var gui = new dat.GUI();
// gui.add(controls, 'rotationSpeed', 0, 0.5);
// gui.add(controls, 'bouncingSpeed', 0, 0.5);
// gui.add(controls, 'addCube');

// render scene --------------------------------------------------------

function initStats() {
// attach stats window to DOM
var stats = new Stats();
stats.setMode(0); // 0 for FPS, 1 for rendering time
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.right = '0px';
$('#Stats-output').append(stats.domElement);
return stats;
};
