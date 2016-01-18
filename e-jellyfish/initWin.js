/**
 * Created by WQ on 2015/12/31.
 */
// JavaScript Document<script type="text/javascript">
var gl;
var canvas , docWidth , docHeight;

function initWin( w , h ) {
    docWidth = w || $( window ).width();
    docHeight = h || $( window ).height();
    $( "#webgl-canvas" ).width( docWidth );
    $( "#webgl-canvas" ).height( docHeight );
    canvas.width = docWidth;
    canvas.height = docHeight;
    try {
        gl = canvas.getContext( "experimental-webgl" ) || canvas.getContext( "webgl" );
        gl.viewportWidth = docWidth;
        gl.viewportHeight = docHeight;
    } catch ( e ) {
    }
    if ( !gl ) {
        alert( "Your browser failed to initialize WebGL." );
    }
}

$( window ).resize( function () {
    initWin();
} );

function webGLStart() {
    canvas = document.getElementById( "webgl-canvas" );

    initWin();
    initBuffers();
    initShaders();
    initTextures();

    setDebugParam();

    gl.clearColor( 0. , 0. , 0. , 0. );
    gl.clearDepth( 1. );
    gl.blendFunc( gl.SRC_ALPHA , gl.ONE_MINUS_SRC_ALPHA );
    gl.enable( gl.BLEND );
    gl.enable( gl.DEPTH_TEST );
    gl.depthFunc( gl.LEQUAL );

    interact();
    animate();
}