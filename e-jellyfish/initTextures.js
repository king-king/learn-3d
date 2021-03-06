/**
 * Created by WQ on 2015/12/31.
 */
// JavaScript Document
var texture = {};
var textureOK = {};

// 这里一次性加载34张纹理图的方式值得学习
function initTextures() {
    loadTexture( 'jellyfish' , 'img/jellyfish.png' );
    loadTexture( 'luminescence' , 'img/luminescence.png' );

    for ( var i = 1; i <= 32; i++ ) {
        loadTexture( 'caustics' + i , 'img/caustics7.' + pad2( i - 1 ) + '.jpg' );
    }
}

function loadTexture( label , path ) {
    textureOK[ label ] = 0;
    var imageFile = new Image();
    imageFile.src = path;
    texture[ label ] = gl.createTexture();
    texture[ label ].image = imageFile;
    imageFile.onload = function () {
        handleLoadedTexture( texture[ label ] , label );
    }
}

// 先向texture中写入图片,等到使用的时候再向拾取器传入
function handleLoadedTexture( textures , label ) {
    gl.pixelStorei( gl.UNPACK_FLIP_Y_WEBGL , true );
    gl.bindTexture( gl.TEXTURE_2D , textures );
    gl.texImage2D( gl.TEXTURE_2D , 0 , gl.RGBA , gl.RGBA , gl.UNSIGNED_BYTE , textures.image );
    gl.texParameteri( gl.TEXTURE_2D , gl.TEXTURE_MAG_FILTER , gl.LINEAR );
    gl.texParameteri( gl.TEXTURE_2D , gl.TEXTURE_MIN_FILTER , gl.LINEAR_MIPMAP_NEAREST );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.bindTexture( gl.TEXTURE_2D , null );
    textureOK[ label ] = 1;
}

//  等到实际使用的时候再传入,注意可以直接绑定一个有内容的texture,然后直接传输
function bindTexture( name , i ) {
    if ( textureOK[ name ] == 1 ) {
        if ( i == 0 ) gl.activeTexture( gl.TEXTURE0 );
        if ( i == 1 ) gl.activeTexture( gl.TEXTURE1 );
        if ( i == 2 ) gl.activeTexture( gl.TEXTURE2 );
        gl.bindTexture( gl.TEXTURE_2D , texture[ name ] );
        gl.uniform1i( currentProgram.sampler[ i ] , i );
    }
}

function pad2( number ) {
    return (parseInt( number ) < 10 ? '0' : '') + parseInt( number )
}