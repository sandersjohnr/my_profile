/*
 *    MY PROFILE SITE in THREE.js
 *    @author = enoblue
 */
// window.onload = (function() {
// initialize stats module
// var stats = initStats();
var clock = new THREE.Clock();

// constants
var WIDTH = window.innerWidth,
    HEIGHT = window.innerHeight,
    PIXEL_RATIO = window.devicePixelRatio,

    // camera
    VIEW_ANGLE = 30,
    ASPECT = WIDTH / HEIGHT,
    NEAR = 1,
    FAR = 700,
    FOG_NEAR = 70,
    FOG_FAR = 200,
    CAMERA_DISTANCE = 60,

    // spots
    SPOT_ANGLE = Math.PI / 8,
    SPOT_INTENSITY = 1.5,
    SPOT_DISTANCE = 1000,

    // positioning
    PANEL_Y = 9.6,
    SCENE_WIDTH = 90,

    // timing
    TRANS_DURATION = 2000,
    INFO_DURATION = TRANS_DURATION,
    INFO_FINAL_Y = 4.0,
    INFO_DELAY = 0,
    LINK_FINAL_Y = 1.75,
    LINK_DURATION = TRANS_DURATION,
    LINK_DELAY = 0,
    SWIVEL_SPEED = 7,
    LIGHT_SPEED = 0.02;

// initialize globals
var camera, cameraControls, scene, renderer, fog,
    panel_1, panel_2, panel_3, mirrorMesh, groun,Mirror, selectableObjects,
    info_1, info_2, info_3,
    link_1, link_2, link_3,
    spotOne, spotTwo, spotThree, spotFour,
    lightSpeed = LIGHT_SPEED,
    frame = 0,
    mouseX = WIDTH / 2,
    mouseY = HEIGHT / 2,
    composer;

function init() {

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio( PIXEL_RATIO );
  renderer.setSize( WIDTH, HEIGHT );
  renderer.setClearColor( 0x220000, 1.0 );

  // scene
  scene = new THREE.Scene();
  // axes
  // var axes = new THREE.AxisHelper(20);
  // scene.add(axes);

  // camera
  camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

  // Nav menu GUI
  var button_w = 2;
  var button_h = 0.8;
  var textSize = 0.4;
  var textDist = -30;
  var textOffset = -1;
  var textX = ASPECT * 3;
  var textY = 7;
  var xScale = 1.2;
  var boxOffsetY = 0.18;
  var boxOffsetX = 1.3;

  guiButton_1 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(button_w, button_h, 1),
    new THREE.MeshBasicMaterial({ color: 0x220000 } ));
  guiButton_2 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(button_w * 1.25, button_h, 1),
    new THREE.MeshBasicMaterial({ color: 0x220000  } ));
  guiButton_3 = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(button_w * 1.25, button_h, 1),
    new THREE.MeshBasicMaterial({ color: 0x220000 } ));

  guiButton_1.position.set( -textX * boxOffsetX, textY + boxOffsetY, textDist-0.1);
  guiButton_2.position.set( 0-0.2, textY + boxOffsetY, textDist-0.1);
  guiButton_3.position.set( textX * boxOffsetX - 0.7, textY + boxOffsetY, textDist-0.1);
  camera.add(guiButton_1);
  camera.add(guiButton_2);
  camera.add(guiButton_3);

  guiText_1 = createTextEmissive('home', textSize, 0, 0xddaaaa);
  guiText_2 = createTextEmissive('projects', textSize, 0, 0xddaaaa);
  guiText_3 = createTextEmissive('contact', textSize, 0, 0xddaaaa);
  guiText_1.position.set( (-textX + textOffset) * xScale, textY, textDist);
  guiText_2.position.set( (0 + textOffset) * xScale , textY, textDist);
  guiText_3.position.set( (textX + textOffset) * xScale, textY, textDist);

  camera.add(guiText_1);
  camera.add(guiText_2);
  camera.add(guiText_3);

  scene.add(camera);

  // controls
  cameraControls = new THREE.FlyControls(camera);
  cameraControls.movementSpeed = 135;
  cameraControls.rollSpeed = Math.PI / 12;
  cameraControls.autoForward = false;
  cameraControls.dragToLook = true;

  // attach to DOM
  document.getElementById('WebGL-output').appendChild(renderer.domElement);

  // effects

  // var renderPass = new THREE.RenderPass(scene, camera);
  // var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
  // effectCopy.renderToScreen = true;
  // var bloomPass = new THREE.BloomPass( 1.5      // strength
                                    //  , 25    // kernelSize
                                    //  , 0.5    // sigma ( higher is blurrier )
                                    //  , 2048    //resolution
                                    //  );
  // bloomPass.renderToScreen = true;

  // composer = new THREE.EffectComposer(renderer);
  // composer.addPass(renderPass);
  // composer.addPass(bloomPass);
  // composer.addPass(effectCopy);
}

function fillScene() {

  // mirror
  var planeGeo = new THREE.PlaneBufferGeometry(500, 600, 1, 1);
  groundMirror = new THREE.Mirror( renderer, camera,
    { clipBias: 0.003,
      textureWidth: WIDTH,
      textureHeight: HEIGHT,
      color: 0x222222 } );
  mirrorMesh = new THREE.Mesh( planeGeo, groundMirror.material );
  mirrorMesh.add(groundMirror);
  mirrorMesh.rotateX( -Math.PI/2 );
  mirrorMesh.position.set(0, 0, 50);

  // panels
  var panelGeo = new THREE.BoxGeometry(18 * 1.6, 18, 1, 1);
  var panel_1 = createMesh( panelGeo, 'featur_low.jpg' );
  var panel_2 = createMesh( panelGeo, 'hoodz_low.jpg' );
  var panel_3 = createMesh( panelGeo, 'stretchme2_low.jpg' );

  panel_1.rotation.y = (-Math.PI / 2) + Math.PI/8;
  panel_2.rotation.y = Math.PI / -2;
  panel_3.rotation.y = Math.PI / -2 - Math.PI/8;

  panel_1.position.x = 40;
  panel_2.position.x = 45;
  panel_3.position.x = 40;

  panel_1.position.y =
  panel_2.position.y =
  panel_3.position.y = PANEL_Y;

  panel_1.position.z = 0;
  panel_2.position.z = SCENE_WIDTH / 3;
  panel_3.position.z = 2 * SCENE_WIDTH / 3;

  var infoGeo = new THREE.BoxGeometry(8 * 1.6, 8, 0.1, 1);
  info_1 = createMesh(infoGeo, 'featur_slide.jpg');
  info_1.position.set(29, -5, -7);
  info_1.rotation.y = -Math.PI/ 2 + 0.7;

  info_2 = createMesh(infoGeo, 'hoodz_slide.jpg');
  info_2.position.x = 36;
  info_2.position.y = -5;
  info_2.position.z = SCENE_WIDTH / 3 - 8.5;
  info_2.rotation.y = - Math.PI / 2 + 0.2;

  info_3 = createMesh(infoGeo, 'stretchme_slide.jpg');
  info_3.position.x = 27;
  info_3.position.y = -5;
  info_3.position.z = 2 * SCENE_WIDTH / 3 + 6;
  info_3.rotation.y = - Math.PI / 2 - 0.7;

  // contact
  contact = createMesh( new THREE.PlaneBufferGeometry(5*1.6, 5, 1), 'contact.jpg' );
  contact.rotation.y = -Math.PI/2;
  contact.position.set(-59,-3,24);

  // links
  var linkGeo = new THREE.BoxGeometry(3.5, 3.5, 0.1, 1);
  link_1 = createMesh( linkGeo, 'site_link.jpg' );
  link_2 = createMesh( linkGeo, 'site_link.jpg' );
  link_3 = createMesh( linkGeo, 'site_link.jpg' );
  link_1.material.emissive = new THREE.Color( 0x81648D );
  link_2.material.emissive = new THREE.Color( 0x81648D );
  link_3.material.emissive = new THREE.Color( 0x81648D );
  contact.material.emissive = new THREE.Color( 0xeca032 );

  link_1.rotation.y = Math.PI / - 2 + 0.37;
  link_2.rotation.y = Math.PI / - 2 ;
  link_3.rotation.y = Math.PI / - 2 - 0.37;

  link_1.position.x = 40;
  link_2.position.x = 39.5;
  link_3.position.x = 41;

  link_1.position.z = 8.0;
  link_2.position.z = 40;
  link_3.position.z = 49;

  link_1.position.y = -2;
  link_2.position.y = -2;
  link_3.position.y = -2;

  // main about panel
  about_panel = createMesh(panelGeo, 'profile_slide.jpg');
  about_panel.position.x = -50;
  about_panel.position.y = 10;
  about_panel.position.z = SCENE_WIDTH / 3;
  about_panel.rotation.y = - Math.PI / 2;

  // add everything to the scene
  scene.add(mirrorMesh);
  scene.add(panel_1);
  scene.add(panel_2);
  scene.add(panel_3);
  scene.add(info_1);
  scene.add(info_2);
  scene.add(info_3);
  scene.add(link_1);
  scene.add(link_2);
  scene.add(link_3);
  scene.add(contact);
  scene.add(about_panel);

  // lighting for about panel
  aboutSpot1 = new THREE.SpotLight( 0xff0000, 4.0, 100 );
  scene.add(aboutSpot1);
  aboutSpot1.position.x = -96;
  aboutSpot1.position.y = 10;
  aboutSpot1.position.z = 26;

  aboutSpot2 = new THREE.SpotLight( 0x00ff00, 4.0, 100);
  scene.add(aboutSpot2);
  aboutSpot2.position.x = -104;
  aboutSpot2.position.y = 5;
  aboutSpot2.position.z = 42;

  aboutSpot3 = new THREE.SpotLight( 0x0000ff, 4.0, 100);
  scene.add(aboutSpot3);
  aboutSpot3.position.x = -90;
  aboutSpot3.position.y = 17;
  aboutSpot3.position.z = 60;

  // controls = new function() {
  //   this.position1 = 46;
  //   this.position2 = 40;
  //   this.position3 = 36;
  //   this.updatePosition = function() {
  //     aboutSpot1.position.z = controls.position1;
  //     aboutSpot2.position.z = controls.position2;
  //     aboutSpot3.position.z = controls.position3;
  //   }
  // }
  //
  // var gui = new dat.GUI();
  // gui.add(controls, "position1", 10, 70).onChange(controls.updatePosition);
  // gui.add(controls, "position2", 10, 70).onChange(controls.updatePosition);
  // gui.add(controls, "position3", 10, 70).onChange(controls.updatePosition);

  // Lights
  mainLight = new THREE.PointLight(0xcccccc, 0.5, 300);
  mainLight.position.set(0, 20, 20);
  scene.add( mainLight );

  spotOne = new THREE.SpotLight( 0xff0000 );
  spotOne.position.set(0, 0, panel_1.position.z + 20);
  spotOne.angle = SPOT_ANGLE;
  spotOne.intensity = SPOT_INTENSITY;
  spotOne.distance = SPOT_DISTANCE;
  scene.add( spotOne );

  spotTwo = new THREE.SpotLight( 0x0000ff );
  spotTwo.position.set(0, 0, panel_2.position.z);
  spotTwo.angle = SPOT_ANGLE;
  spotTwo.intensity = SPOT_INTENSITY;
  spotTwo.distance = SPOT_DISTANCE;
  scene.add( spotTwo );

  spotThree = new THREE.SpotLight( 0x00ff00 );
  spotThree.position.set(0, 0, panel_3.position.z - 20);
  spotThree.angle = SPOT_ANGLE;
  spotThree.intensity = SPOT_INTENSITY;
  spotThree.distance = SPOT_DISTANCE;
  scene.add( spotThree );

  spotFour = new THREE.SpotLight( 0xffffff );
  spotFour.position.set(-100, 0, about_panel.position.z);
  spotFour.intensity = 3;
  spotFour.distance =120;
      // scene.add(spotFour);

  spotOne.target   = panel_1;
  spotTwo.target   = panel_2;
  spotThree.target = panel_3;
  spotFour.target  = about_panel;

  // set initial camera position for intro swoop
  camera.position.set(-1000, 50, 30);
  camera.lookAt( about_panel.position );

  // scene.fog = new THREE.Fog( 0x290000, FOG_NEAR, FOG_FAR);

  // Pop up text for skills
  var skillNum = 7;
  var skillSize = 2;
  var skillY = 0.6;
  var skillZ = SCENE_WIDTH/(2*skillNum);
  var skillColor = 0xeeeeee;

  skill_1 = createText('three.js', skillSize, 1, skillColor);
  skill_1.position.set(-65, skillY, skillZ*1);
  skill_1.rotation.y = -Math.PI/2;
  scene.add( skill_1 );
  skill_2 = createText('javascript', skillSize, 1, skillColor);
  skill_2.position.set(-73, skillY, skillZ * 2);
  skill_2.rotation.y = -Math.PI/2;
  scene.add( skill_2 );
  skill_3 = createText('jQuery', skillSize, 1, skillColor);
  skill_3.position.set(-60, skillY, skillZ * 3 - 3);
  skill_3.rotation.y = -Math.PI/2;
  scene.add( skill_3 );
  skill_4 = createText('d3.js', skillSize, 1, skillColor);
  skill_4.position.set(-66, skillY, skillZ * 4);
  skill_4.rotation.y = -Math.PI/2;
  scene.add( skill_4 );
  skill_5 = createText('express', skillSize, 1, skillColor);
  skill_5.position.set(-61, skillY, skillZ * 5);
  skill_5.rotation.y = -Math.PI/2;
  scene.add( skill_5 );
  skill_6 = createText('angularJS', skillSize, 1, skillColor);
  skill_6.position.set(-72, skillY, skillZ * 6 - 5);
  skill_6.rotation.y = -Math.PI/2;
  scene.add( skill_6 );
  skill_7 = createText('node', skillSize, 1, skillColor);
  skill_7.position.set(-62, skillY, skillZ * 7);
  skill_7.rotation.y = -Math.PI/2;
  scene.add( skill_7 );


  /* INTERACTION CONTROLS --------------------------------------- */
  navigation = new Navigation();

  document.addEventListener('mousedown', mouseDown , false);
  document.addEventListener('mousemove', mouseMove, false);

  var projector = new THREE.Projector();
  var mouseover = false;
  // init selectables for raycaster
  selectableObjects = [
    about_panel, panel_1, panel_2, panel_3,
    guiButton_1, guiButton_2, guiButton_3, guiText_1, guiText_2, guiText_3
  ];

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
        aboutSlideDown.start();
        resetInfoTwo.start();
        resetInfoThree.start();
        resetLinkTwo.start();
        resetLinkThree.start();
        camToCenterPos.start();
        camRotToPanelOne.start();
        showInfoOne.start();
        showLinkOne.start();
        selectableObjects = [ info_1, link_1, panel_1, panel_2, panel_3,
          guiButton_1, guiButton_2, guiButton_3, guiText_1, guiText_2, guiText_3 ];
        targetSpot(panel_1);

      } else if (selectedObj == panel_2) {
        aboutSlideDown.start();
        resetInfoOne.start();
        resetInfoThree.start();
        resetLinkOne.start();
        resetLinkThree.start();
        showInfoTwo.start();
        showLinkTwo.start();
        camToCenterPos.start();
        camToCenterRot.start();
        selectableObjects = [ panel_1, panel_2, panel_3, info_2, link_2,
          guiButton_1, guiButton_2, guiButton_3, guiText_1, guiText_2, guiText_3 ];
        targetSpot(panel_2);

      } else if (selectedObj == panel_3) {
        aboutSlideDown.start();
        resetInfoOne.start();
        resetInfoTwo.start();
        resetLinkOne.start();
        resetLinkTwo.start();
        camToCenterPos.start();
        camRotToPanelThree.start();
        showInfoThree.start();
        showLinkThree.start();
        selectableObjects = [ panel_1, panel_2, panel_3, info_3, link_3,
          guiButton_1, guiButton_2, guiButton_3, guiText_1, guiText_2, guiText_3 ];
        targetSpot(panel_3);

      } else if (selectedObj == about_panel) {
        navigation.goProjects();

      } else if (selectedObj == info_1 || selectedObj == info_2|| selectedObj == info_3 ||
        selectedObj == guiButton_1 || selectedObj == guiText_1) {
        navigation.goHome();
        selectableObjects = [ about_panel, contact, panel_1, panel_2, panel_3,
          guiButton_1, guiButton_2, guiButton_3, guiText_1, guiText_2, guiText_3 ];

      } else if (selectedObj == guiButton_2 || selectedObj == guiText_2) {
        navigation.goProjects();

      } else if (selectedObj == guiButton_3 || selectedObj == guiText_3) {
        document.getElementById('contact').click();

      } else if (selectedObj == link_1) {
        document.getElementById('featur').click();

      } else if (selectedObj == link_2) {
        document.getElementById('hoodz').click();

      } else if (selectedObj == link_3) {
        document.getElementById('stretchme').click();

      } else if (selectedObj == contact) {
        document.getElementById('contact').click();
      }
    } else {
        //  when clicking on nothing
      navigation.goHome();
      selectableObjects = [ about_panel, contact, panel_1, panel_2, panel_3,
        guiButton_1, guiButton_2, guiButton_3, guiText_1, guiText_2, guiText_3 ];
    }
  }

  function Navigation() {
    this.goHome = function() {
      resetInfoOne.start();
      resetInfoTwo.start();
      resetInfoThree.start();
      resetLinkOne.start();
      resetLinkTwo.start();
      resetLinkThree.start();
      showContact.delay(1500).start();
      camToAboutRot.start();
      camToAboutPos.start();
      aboutSlideUp.delay(800).start();
      splitSpots();

    };
    this.goProjects = function() {
      aboutSlideDown.start();
      resetInfoOne.start();
      resetInfoTwo.start();
      resetInfoThree.start();
      resetLinkOne.start();
      resetLinkTwo.start();
      resetLinkThree.start();
      resetContact.start();
      camToAllPanelsPos.delay(0).start();
      camToAllPanelsRot.delay(0).start();
      selectableObjects = [ panel_1, panel_2, panel_3, guiButton_1, guiButton_2,
        guiButton_3, guiText_1, guiText_2, guiText_3 ];
    };

    return this;
  }

  function mouseMove(event) {
    event.preventDefault();

    // update mouse coordinates for swivel
    mouseX = ( event.clientX - WIDTH / 2 );
    mouseY = ( event.clientY - HEIGHT / 2 );

    // create ray for mouse hover
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    mouse.x = ( event.clientX / WIDTH ) * 2 - 1;
    mouse.y = - ( event.clientY / HEIGHT) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );
    $body = $('body');
    var intersects = raycaster.intersectObjects( selectableObjects );

    if (intersects.length > 0) {
      $body.css('cursor', 'pointer');
      var selectedObj = intersects[0].object;

      if (selectedObj != about_panel) { lightSpeed = LIGHT_SPEED;}

      // focus lighting on hovered-over panel
      if (selectedObj == panel_1) {
        targetSpot(panel_1);
      } else if (selectedObj == panel_2) {
        targetSpot(panel_2);
      } else if (selectedObj == panel_3) {
        targetSpot(panel_3);
      } else if (selectedObj == about_panel) {
        splitSpots();
        lightSpeed = 2 * LIGHT_SPEED;
      }

    } else {
      $body.css('cursor', 'default');
      lightSpeed = LIGHT_SPEED;
    }

  }

  function splitSpots() {
    spotOne.target = panel_1;
    spotTwo.target = panel_2;
    spotThree.target = panel_3;
  }

  function targetSpot(spotTarget) {
    mainLight.target =
    spotOne.target =
    spotTwo.target =
    spotThree.target = spotTarget;
  }

}

function createText(textString, size, height, color) {
  var options = { size: size,
                  height: height,
                  font: 'helvetiker',
                  weight: 'normal',
                  style: 'normal',
                  bevelEnabled: false,
                  // , bevelThickness: 0.5
                  // , bevelSize: 1
                  // , bevelSegments: 5
                  // , curveSegments: 5
                  steps: 1
                };
  var geom = new THREE.TextGeometry(textString, options);
  var meshMat = new THREE.MeshPhongMaterial({
    color: color
    // metal: true,
    // specular: 0xffffff,
    // shininess: 100
  });
  // meshMat.side = THREE.DoubleSide;
  // var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMat]);
  return new THREE.Mesh(geom, meshMat);
}

function createTextEmissive(textString, size, height, color) {
  var options = { size: size,
                  height: height,
                  font: 'helvetiker',
                  weight: 'normal',
                  style: 'normal',
                  bevelEnabled: false,
                  // , bevelThickness: 0.5
                  // , bevelSize: 1
                  // , bevelSegments: 5
                  // , curveSegments: 5
                  steps: 1
                };
  var geom = new THREE.TextGeometry(textString, options);
  var meshMat = new THREE.MeshPhongMaterial({
    emissive: color
    // metal: true,
    // specular: 0xffffff,
    // shininess: 100
  });
  // meshMat.side = THREE.DoubleSide;
  // var mesh = THREE.SceneUtils.createMultiMaterialObject(geom, [meshMat]);
  return new THREE.Mesh(geom, meshMat);
}

function createAnimations() {

  var cubicInOut = TWEEN.Easing.Cubic.InOut;

  camToAllPanelsPos = new TWEEN.Tween(camera.position)
    .to({ x: -59.5435, y: 14.2569, z: 30.0021 }, TRANS_DURATION)
    .easing(cubicInOut);

  camToAllPanelsRot = new TWEEN.Tween(camera.quaternion)
    .to({ x: -0.0198, y: -0.7063, z: -0.02000, w: 0.7073 }, TRANS_DURATION)
    .easing(cubicInOut);

  camToCenterPos = new TWEEN.Tween(camera.position)
    .to({ x: -6.542, y: 15.137, z: 29.982 }, TRANS_DURATION)
    .easing(cubicInOut);

  camRotToPanelOne = new TWEEN.Tween(camera.quaternion)
    .to({x: -0.0213, y: -0.4794, z: -0.0498, w: 0.8759 }, TRANS_DURATION)
    .easing(cubicInOut);

  camToCenterRot = new TWEEN.Tween(camera.quaternion)
    .to({ x: -0.0439, y: -0.7014, z: -0.0465, w: 0.7099 }, TRANS_DURATION)
    .easing(cubicInOut);

  camRotToPanelThree = new TWEEN.Tween(camera.quaternion)
    .to({ x: -0.03395, y: -0.8828, z: -0.0283, w: 0.4676 }, TRANS_DURATION)
    .easing(cubicInOut);

  camToAboutPos = new TWEEN.Tween(camera.position)
    .to({ x: -122.9631, y: 22.9548, z: 30.0313 }, TRANS_DURATION)
    .easing(cubicInOut);

  camToAboutRot = new TWEEN.Tween(camera.quaternion)
    .to({ x: -0.0659, y: -0.7037, z: -0.0661, w: 0.7044 }, TRANS_DURATION )
    .easing(cubicInOut);

  aboutSlideUp = new TWEEN.Tween(about_panel.position)
    .to({ y: 10 }, TRANS_DURATION / 1.7)
    .easing(cubicInOut);

  aboutSlideDown = new TWEEN.Tween(about_panel.position)
    .to({ y: -10 }, TRANS_DURATION / 1.7)
    .easing(cubicInOut);

  showInfoOne = new TWEEN.Tween(info_1.position)
    .to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .easing(cubicInOut)
    .delay( INFO_DELAY );

  showInfoTwo = new TWEEN.Tween(info_2.position)
    .to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .easing(cubicInOut)
    .delay(INFO_DELAY );

  showInfoThree = new TWEEN.Tween(info_3.position)
    .to({ y: INFO_FINAL_Y }, INFO_DURATION)
    .easing(cubicInOut)
    .delay(INFO_DELAY);

  resetInfoOne = new TWEEN.Tween(info_1.position)
    .to({ y: -5 }, INFO_DURATION * 0.5)
    .easing(cubicInOut);

  resetInfoTwo = new TWEEN.Tween(info_2.position)
    .to({ y: -5 }, INFO_DURATION * 0.5)
    .easing(cubicInOut);

  resetInfoThree = new TWEEN.Tween(info_3.position)
    .to({ y: -5 }, INFO_DURATION * 0.5)
    .easing(cubicInOut);

  showLinkOne = new TWEEN.Tween(link_1.position)
    .to({ y: LINK_FINAL_Y }, LINK_DURATION)
    .easing(cubicInOut)
    .delay(LINK_DELAY);

  showLinkTwo = new TWEEN.Tween(link_2.position)
    .to({ y: LINK_FINAL_Y }, LINK_DURATION)
    .easing(cubicInOut)
    .delay(LINK_DELAY);

  showLinkThree = new TWEEN.Tween(link_3.position)
    .to({ y: LINK_FINAL_Y }, LINK_DURATION)
    .easing(cubicInOut)
    .delay(LINK_DELAY);

  showContact = new TWEEN.Tween(contact.position)
    .to({ y: 2.5 }, LINK_DURATION * 0.5)
    .easing(cubicInOut);

  resetContact = new TWEEN.Tween(contact.position)
    .to({ y: -3 }, LINK_DURATION * 0.5)
    .easing(cubicInOut);

  resetLinkOne = new TWEEN.Tween(link_1.position)
    .to({ y: -3 }, INFO_DURATION * 0.5)
    .easing(cubicInOut);

  resetLinkTwo = new TWEEN.Tween(link_2.position)
    .to({ y: -3 }, INFO_DURATION * 0.5)
    .easing(cubicInOut);

  resetLinkThree = new TWEEN.Tween(link_3.position)
    .to({ y: -3 }, INFO_DURATION * 0.5)
    .easing(cubicInOut);

  //send cam to initial far view
  camToAboutPos.delay(0).start();
  camToAboutRot.delay(0).start();
}

// helper functions
function createMesh(geom, imageFile) {
  var texture = THREE.ImageUtils.loadTexture('assets/images/' + imageFile, THREE.UVMapping);
  // texture.minFilter = THREE.LinearFilter;
  // texture.magFilter = THREE.LinearFilter;
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
}

// render loop
function render() {
  // helper module to rerender on window resize
  // THREEx.WindowResize(renderer, camera);
  // render the mirror
  groundMirror.render();
  // render scene
  renderer.render(scene, camera);
  // composer.render(delta)
}

function update() {
  // debugging camera position
  // if (!(frame++ % 300)) console.log(camera.position, camera.quaternion);
  lightingControl();
  swivelControl();
  // update packages
  TWEEN.update();
  // stats.update();
  delta = clock.getDelta();
  // cameraControls.update(delta);

  // grab frame from browser
  requestAnimationFrame( update );
  render();
}

function swivelControl() {
  camera.position.z += ( mouseX - camera.position.z ) * 0.000001 * SWIVEL_SPEED;
  camera.position.y += ( - mouseY - camera.position.y ) * 0.000001 * SWIVEL_SPEED;
}

var step = 0.0;
function lightingControl() {
  step += lightSpeed;

  aboutSpot1.position.z = 30 + Math.sin(step) * 30;
  aboutSpot2.position.z = 30 + Math.sin(step * 0.8 + 2 * Math.PI / 3) * 30;
  aboutSpot3.position.z = 30 + Math.sin(step * 1.2 - 2 * Math.PI / 3) * 30;
  aboutSpot1.position.y = Math.sin(step * 0.8) * 20;
  aboutSpot2.position.y = Math.sin(step * 1.2 + 2 * Math.PI / 3) * 20;
  aboutSpot3.position.y = Math.sin(step - 2 * Math.PI / 3) * 20;

  aboutSpot1.target = about_panel;
  aboutSpot2.target = about_panel;
  aboutSpot3.target = about_panel;
}

init();
fillScene();
createAnimations();
update();

// }); // end ONLOAD fn

window.onresize = function(){ location.reload(); };
