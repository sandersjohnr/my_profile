
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

var PANEL_Y = 10;
var SCENE_WIDTH = 90;
var TRANS_DURATION = 1750;

var INFO_FINAL_Y = 4.5;
var INFO_DURATION = TRANS_DURATION;
var INFO_DELAY = 0;

// initialize globals
var camera, cameraControls, scene, renderer, fog;
var info_1, panel_1, panel_2, panel_3, mirrorMesh, groundMirror, selectableObjects;
var spotOne, spotTwo, spotThree;
var Views = {};
var Tweens = {};

function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio( PIXEL_RATIO );
  renderer.setSize(WIDTH, HEIGHT);
  renderer.setClearColor(0x220000, 1.0);

  // scene
  scene = new THREE.Scene();
  // axes
  var axes = new THREE.AxisHelper(20);
  // scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

  // controls
  // cameraControls = new THREE.FlyControls(camera);
  // cameraControls.movementSpeed = 135;
  // cameraControls.rollSpeed = Math.PI / 12;
  // cameraControls.autoForward = false;
  // cameraControls.dragToLook = true;

  // attach to DOM
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
  // create variable controller
  controls = new function() {

    this.objPosX = 0;
    this.objPosY = 0;
    this.objPosZ = 0;

    this.objRotY = 0;

  }

  // var gui = new dat.GUI();
  // gui.add(controls, 'objRotY', -2*Math.PI, 2*Math.PI);
  // gui.add(controls, 'objPosX', 0, 100);
  // gui.add(controls, 'objPosY', -20, 50);
  // gui.add(controls, 'objPosZ', 0, SCENE_WIDTH);


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

  var infoGeo = new THREE.PlaneBufferGeometry(8 * 1.6, 8, 1, 1);
  // info_1 = new THREE.Mesh(infoGeo, new THREE.MeshLambertMaterial({ color:0x333333 }));
  info_1 = createMesh(infoGeo, 'featur.png');
  info_1.position.x = 31;
  info_1.position.y = -5;
  info_1.position.z = -7;
  info_1.rotation.y = -0.4268;
  scene.add(info_1);
  // info_2 = new THREE.Mesh(infoGeo, new THREE.MeshLambertMaterial({ color:0xffffff }));
  info_2 = createMesh(infoGeo, 'hoodz.png');
  info_2.position.x = 38;
  info_2.position.y = -5;
  info_2.position.z = SCENE_WIDTH / 3 - 8.5;
  info_2.rotation.y = - Math.PI / 2;
  scene.add(info_2);
  // info_3 = new THREE.Mesh(infoGeo, new THREE.MeshLambertMaterial({ color:0xffffff }));
  info_3 = createMesh(infoGeo, 'stretchme.png');
  info_3.position.x = 31;
  info_3.position.y = -5;
  info_3.position.z = 2 * SCENE_WIDTH / 3 + 7;
  info_3.rotation.y = - Math.PI / 2 - .7;
  scene.add(info_3);

  // init selectables for raycaster
  selectableObjects = [ panel_1, panel_2, panel_3 ];

  // Lights
  var mainLight = new THREE.PointLight(0xcccccc, 0.5, 300);
  mainLight.position.set(0, 20, 20);
  scene.add( mainLight );

  var ambiLight = new THREE.AmbientLight(0x333333)
  // scene.add(ambiLight)

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

  spotOne.target = panel_1;
  spotTwo.target = panel_2;
  spotThree.target = panel_3;

  camera.position.set(-CAMERA_DISTANCE, 20, panel_2.position.z);
  camera.lookAt(panel_2.position);

  // scene.fog = new THREE.Fog( 0x000000, 1, FOG_DEPTH);


  /* INTERACTION CONTROLS --------------------------------------- */
  document.addEventListener('mousedown', onDocumentMouseDown, false);
  document.addEventListener('mousemove', onDocumentMouseMove, false);
  var projector = new THREE.Projector();

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
      var selectedObj = intersects[0].object;

      if (selectedObj == panel_1) {
        // document.getElementById('featur').click();
        resetInfoTwo.start();
        resetInfoThree.start();
        camToCenterPos.start();
        camRotToPanelTwo.start();
        camRotToPanelOne.start();
        showInfoOne.start()

      } else if (selectedObj == panel_2) {
        resetInfoOne.start()
        resetInfoThree.start();
        camToCenterPos.start();
        camRotToPanelTwo.start();
        showInfoTwo.start();
        // document.getElementById('hoodz').click();

      } else if (selectedObj == panel_3) {
        resetInfoOne.start();
        resetInfoTwo.start();
        camToCenterPos.start();
        camRotToPanelTwo.start();
        camRotToPanelThree.start();
        showInfoThree.start();
        // document.getElementById('stretchme').click();

      } else if (selectedObj == info_1) {

      }
    } else {
        camToAllPanels.start();
        camRotToPanelTwo.start();
        resetInfoOne.start();
        resetInfoTwo.start();
        resetInfoThree.start();
        spotOne.target = panel_1;
        spotTwo.target = panel_2;
        spotThree.target = panel_3;
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
      var selectedObj = intersects[0].object;

      // if not already mouse-ing over, then now we are
      if (!mouseover) {
        mouseover = true;

        // focus lighting on hovered-over panel
        if (selectedObj == panel_1) {
          mainLight.target =
          spotOne.target =
          spotTwo.target =
          spotThree.target = panel_1;

        } else if (selectedObj == panel_2) {
          mainLight.target =
          spotOne.target =
          spotTwo.target =
          spotThree.target = panel_2;

        } else if (selectedObj == panel_3) {
          mainLight.target =
          spotOne.target =
          spotTwo.target =
          spotThree.target = panel_3;

        }
      }
    } else {
      mouseover = false;
      $('body').css('cursor', 'default');
      // spotOne.target = panel_1;
      // spotTwo.target = panel_2;
      // spotThree.target = panel_3;
    }
  };

}

function createAnimations() {
  // var elasticInOut = new TWEEN.Easing.Elastic.InOut();

  camToAllPanels = new TWEEN.Tween(camera.position)
    .to({ x: -60, y: 20, z: 30 }, TRANS_DURATION);

  camToCenterPos = new TWEEN.Tween(camera.position)
    .to({ x: -6.542, y: 15.137, z: 29.982 }, TRANS_DURATION);

  camRotToPanelOne = new TWEEN.Tween(camera.rotation)
    .to({ x: -0.1564, y: -0.9931, z: -0.1985 }, TRANS_DURATION);

  camRotToPanelTwo = new TWEEN.Tween(camera.rotation)
    .to({ x: -1.6, y: -1.4844, z: -1.6 }, TRANS_DURATION);

  camRotToPanelThree = new TWEEN.Tween(camera.rotation)
    .to({ x: -2.997, y: -0.9680, z: -2.9886 }, TRANS_DURATION);


  showInfoOne = new TWEEN.Tween(info_1.position).to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .delay(INFO_DELAY);
  showInfoTwo = new TWEEN.Tween(info_2.position).to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .delay(INFO_DELAY);
  showInfoThree = new TWEEN.Tween(info_3.position).to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .delay(INFO_DELAY);
  resetInfoOne = new TWEEN.Tween(info_1.position).to({ y: -5 }, INFO_DURATION * 0.5)
  resetInfoTwo = new TWEEN.Tween(info_2.position).to({ y: -5 }, INFO_DURATION * 0.5)
  resetInfoThree = new TWEEN.Tween(info_3.position).to({ y: -5 }, INFO_DURATION * 0.5)
}

function render() {
  // helper module to rerender on window resize
  THREEx.WindowResize(renderer, camera);
  //render the mirror
  groundMirror.render();

  renderer.render(scene, camera);

}

var frame = 0;
function update() {
  frame+=1;
  // if (!(frame % 120)) console.log(camera.position, camera.rotation);
  TWEEN.update();
  requestAnimationFrame( update );
  // stats.update();
  var delta = clock.getDelta();
  // cameraControls.update(delta);

  // info_1.rotation.y = controls.objRotY;
  // info_1.position.x = controls.objPosX;
  // info_1.position.y = controls.objPosY;
  // info_1.position.z = controls.objPosZ;
  render();
}

init();
fillScene();
createAnimations();
update();

function createMesh(geom, imageFile) {
  var texture = THREE.ImageUtils.loadTexture('assets/images/' + imageFile);
  var mat = new THREE.MeshLambertMaterial();
  mat.map = texture;
  var mesh = new THREE.Mesh(geom, mat);
  return mesh;
}

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
