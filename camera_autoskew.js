document.addEventListener( 'mousemove', onDocumentMouseMove, false );

    }

    windowHalfX = WIDTH / 2;
    windowHalfY = HEIGHT / 2;


    function onDocumentMouseMove(event) {

      mouseX = ( event.clientX - windowHalfX );
      mouseY = ( event.clientY - windowHalfY );

    }


    function animate() {

      requestAnimationFrame( animate );

      render();
      stats.update();

    }

    function swivel() {

      camera.position.x += ( mouseX - camera.position.x ) * .05;
      camera.position.y += ( - ( mouseY - 200) - camera.position.y ) * .05;

      camera.lookAt( scene.position );
