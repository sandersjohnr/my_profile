
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
var FOG_NEAR = 70;
var FOG_FAR = 200;
var CAMERA_DISTANCE = 60;

var SPOT_ANGLE = Math.PI / 8;
var SPOT_INTENSITY = 1.5;
var SPOT_DISTANCE = 1000;

var PANEL_Y = 10;
var SCENE_WIDTH = 90;

var TRANS_DURATION = 2000;
var INFO_DURATION = TRANS_DURATION;
var INFO_FINAL_Y = 4.0;
var INFO_DELAY = 0;

// initialize globals
var camera, cameraControls, scene, renderer, fog;
var panel_1, panel_2, panel_3, mirrorMesh, groundMirror, selectableObjects;
var spotOne, spotTwo, spotThree, spotFour;


function init() {
  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio( PIXEL_RATIO );
  renderer.setSize( WIDTH, HEIGHT );
  renderer.setClearColor( 0x220000, 1.0 );

  // scene
  scene = new THREE.Scene();
  // axes
  var axes = new THREE.AxisHelper(20);
  // scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

  // controls
  cameraControls = new THREE.FlyControls(camera);
  cameraControls.movementSpeed = 135;
  cameraControls.rollSpeed = Math.PI / 12;
  cameraControls.autoForward = false;
  cameraControls.dragToLook = true;

  // attach to DOM
  document.getElementById('WebGL-output').appendChild(renderer.domElement);

}

function fillScene() {

  // mirror
  var planeGeo = new THREE.PlaneBufferGeometry(300, 200, 1, 1);
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
  var panel_3 = createMesh(panelGeo, 'stretchme2.png');

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
  info_1 = createMesh(infoGeo, 'feature_slide.png');
  info_1.position.x = 31;
  info_1.position.y = -5;
  info_1.position.z = -7;
  info_1.rotation.y = -0.4268;
  scene.add(info_1);
  info_2 = createMesh(infoGeo, 'cage2.jpg');
  info_2.position.x = 38;
  info_2.position.y = -5;
  info_2.position.z = SCENE_WIDTH / 3 - 8.5;
  info_2.rotation.y = - Math.PI / 2;
  scene.add(info_2);
  info_3 = createMesh(infoGeo, 'murray2.jpg');
  info_3.position.x = 31;
  info_3.position.y = -5;
  info_3.position.z = 2 * SCENE_WIDTH / 3 + 7;
  info_3.rotation.y = - Math.PI / 2 - .7;
  scene.add(info_3);

  about_panel = createMesh(panelGeo, 'murray.jpg');
  about_panel.position.x = -50;
  about_panel.position.y = 9.7;
  about_panel.position.z = SCENE_WIDTH / 3;
  about_panel.rotation.y = - Math.PI / 2;
  scene.add(about_panel)


  // init selectables for raycaster
  selectableObjects = [ about_panel ];

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

  var spotFour = new THREE.SpotLight( 0xffffff );
      spotFour.position.set(-100, 0, about_panel.position.z);
      spotFour.intensity = 3;
      spotFour.distance =120;
      scene.add(spotFour);

  spotOne.angle = SPOT_ANGLE;
  spotTwo.angle = SPOT_ANGLE;
  spotThree.angle = SPOT_ANGLE;

  spotOne.target = panel_1;
  spotTwo.target = panel_2;
  spotThree.target = panel_3;
  spotFour.target = about_panel;

  // camera.lookAt(about_panel.position);
  camera.position.set(-122.963097, 22.954800, 30.03125354854376);
  camera.quaternion.set(-0.06590594671466238, -0.7036826401752501, -0.06613654855920603, 0.704352969077514);

  // scene.fog = new THREE.Fog( 0x290000, FOG_NEAR, FOG_FAR);


  /* INTERACTION CONTROLS --------------------------------------- */
  navigation = new Navigation();

  document.addEventListener('mousedown', mouseDown , false);
  document.addEventListener('mousemove', mouseMove, false);
  document.getElementById('home').addEventListener('click', navigation.goHome, false);
  document.getElementById('projects').addEventListener('click', navigation.goProjects, false);
  document.getElementById('contact').addEventListener('click', navigation.goContact, false);

  var projector = new THREE.Projector();

  var mouseover = false;

  // when clicked, panel takes user to corresponding project page
  function mouseDown (event) {
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
        // camToCenterRot.start();
        camRotToPanelOne.start();
        showInfoOne.start()
        selectableObjects = [info_1, panel_2, panel_3, panel_1];
        spotOne.target = panel_1;
        spotTwo.target = panel_1;
        spotThree.target = panel_1;

      } else if (selectedObj == panel_2) {
        resetInfoOne.start()
        showInfoTwo.start();
        resetInfoThree.start();
        camToCenterPos.start();
        camToCenterRot.start();
        selectableObjects = [ panel_1, panel_2, panel_3, info_2];
        // document.getElementById('hoodz').click();
        spotOne.target = panel_2;
        spotTwo.target = panel_2;
        spotThree.target = panel_2;

      } else if (selectedObj == panel_3) {
        resetInfoOne.start();
        resetInfoTwo.start();
        camToCenterPos.start();
        // camToCenterRot.start();
        camRotToPanelThree.start();
        showInfoThree.start();
        selectableObjects = [ panel_1, panel_2, panel_3, info_3];
        // document.getElementById('stretchme').click();
        spotOne.target = panel_3;
        spotTwo.target = panel_3;
        spotThree.target = panel_3;

      } else if (selectedObj == about_panel) {
        navigation.goProjects();

      }
      else if (selectedObj == info_1 || selectedObj ==info_2|| selectedObj == info_3) {
      //
        resetInfoOne.start();
        resetInfoTwo.start();
        resetInfoThree.start();        // camToAboutPos.start().chain(aboutSlideUp)
        // camToAboutRot.start();
        navigation.goProjects();
        // selectableObjects = [ about_panel ];
        selectableObjects = [ panel_1, panel_2, panel_3 ];
        splitSpots();
      //
      }
    // if not clicking on a selectable object
    } else {
        // camToAboutRot.start();
        // resetInfoOne.start();
        // resetInfoTwo.start();
        // resetInfoThree.start();
        // spotOne.target = panel_1;
        // spotTwo.target = panel_2;
        // spotThree.target = panel_3;
    }
  };

  function mouseMove(event) {
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

  function Navigation() {
    this.goHome = function() {
      console.log('fired');
      camToAboutRot.start()
      camToAboutPos.start()
      aboutSlideUp.delay(800).start();
      selectableObjects = [ about_panel ];
    };
    this.goProjects = function() {
      aboutSlideDown.start()
      camToAllPanelsPos.delay(0).start();
      camToAllPanelsRot.delay(0).start();
      selectableObjects = [ panel_1, panel_2, panel_3 ];
    };

    return this;
  };

  function splitSpots() {
    spotOne.target = panel_1;
    spotTwo.target = panel_2;
    spotThree.target = panel_3;
  }


}

function createAnimations() {
  var cubicInOut = TWEEN.Easing.Cubic.InOut;

  camToAllPanelsPos = new TWEEN.Tween(camera.position)
    .to({ x: -59.54352335165649, y: 14.25687419637257, z: 30.00209916590959 }, TRANS_DURATION).easing(cubicInOut);

  camToAllPanelsRot = new TWEEN.Tween(camera.quaternion)
    .to({ x: -0.01975355680967178, y: -0.706306598007348, z: -0.019965489891478394, w: 0.7073486875778077}, TRANS_DURATION).easing(cubicInOut);

  camToCenterPos = new TWEEN.Tween(camera.position)
    .to({ x: -6.542, y: 15.137, z: 29.982 }, TRANS_DURATION)
    .easing(cubicInOut);

  camRotToPanelOne = new TWEEN.Tween(camera.quaternion)
    .to({x: -0.021287458584909436, y: -0.479407732339669, z: -0.04982128665781585, w: 0.8759183236327985 }, TRANS_DURATION).easing(cubicInOut);

  camToCenterRot = new TWEEN.Tween(camera.quaternion)
    .to({x: -0.04393434405746349, y: -0.7014426078843721, z: -0.04648062502507888, w: 0.7098504016719926}, TRANS_DURATION).easing(cubicInOut);

  camRotToPanelThree = new TWEEN.Tween(camera.quaternion)
    .to({x: -0.03395, y: -0.882815433035953, z: -0.02828177804576746, w: 0.467636822483294}, TRANS_DURATION).easing(cubicInOut);

  camToAboutPos = new TWEEN.Tween(camera.position)
    .to({x: -122.96309744347579, y: 22.954800237042452, z: 30.03125354854376}, TRANS_DURATION).easing(cubicInOut);
  camToAboutRot = new TWEEN.Tween(camera.quaternion)
  .to({x: -0.06590594671466238, y: -0.7036826401752501, z: -0.06613654855920603, w: 0.704352969077514}, TRANS_DURATION).easing(cubicInOut);

  aboutSlideUp = new TWEEN.Tween(about_panel.position).to({y:10}, TRANS_DURATION / 1.7);
  aboutSlideDown = new TWEEN.Tween(about_panel.position).to({y:-10}, TRANS_DURATION / 1.7);

  showInfoOne = new TWEEN.Tween(info_1.position).to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .delay(INFO_DELAY);
  showInfoTwo = new TWEEN.Tween(info_2.position).to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .delay(INFO_DELAY);
  showInfoThree = new TWEEN.Tween(info_3.position).to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .delay(INFO_DELAY);
  resetInfoOne = new TWEEN.Tween(info_1.position).to({ y: -5 }, INFO_DURATION * 0.5)
  resetInfoTwo = new TWEEN.Tween(info_2.position).to({ y: -5 }, INFO_DURATION * 0.5)
  resetInfoThree = new TWEEN.Tween(info_3.position).to({ y: -5 }, INFO_DURATION * 0.5)

  //send cam to initial far view
  camToAboutPos.delay(0).start()
  camToAboutRot.delay(0).start()
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
  if (!(frame % 300)) console.log(camera.position, camera.quaternion);
  TWEEN.update();
  requestAnimationFrame( update );
  // stats.update();
  var delta = clock.getDelta();
  // cameraControls.update(delta);

  render();
}

function createMesh(geom, imageFile) {
  var texture = THREE.ImageUtils.loadTexture('assets/images/' + imageFile, THREE.UVMapping);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  var mat = new THREE.MeshLambertMaterial();
  mat.map = texture;
  var mesh = new THREE.Mesh(geom, mat);
  return mesh;
}



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

init();
fillScene();
createAnimations();
update();
