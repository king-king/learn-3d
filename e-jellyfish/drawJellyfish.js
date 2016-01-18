/**
 * Created by WQ on 2015/12/31.
 */
var delta = new V3.$( 0 , 0 , 0 );
var deltaNorm = new V3.$( 0 , 0 , 0 );
var force = new V3.$( 0 , 0 , 0 );
var accel = new V3.$( 0 , 0 , 0 );
var eyeDist = new V3.$( 0 , 0 , 0 );

var jellyfish = {};
jellyfish.count = 0;
jellyfish.order = [];

// 多删少补
function interpolateTargets() {
    while ( jellyfish.count != jellyfishTargets.count ) {
        if ( jellyfish.count < jellyfishTargets.count ) {
            jellyfish[ jellyfish.count ] = new JellyfishInstance(
                jellyfishTargets[ jellyfish.count ].pos ,
                jellyfishTargets[ jellyfish.count ].scl ,
                jellyfishTargets[ jellyfish.count ].time );
            jellyfish.count += 1;
        }
        else if ( jellyfish.count > jellyfishTargets.count ) {
            jellyfish.count -= 1;
            delete jellyfish[ jellyfish.count ];
        }
        jellyfish.order = jellyfishTargets.order;
    }

    for ( var i = 0; i < jellyfish.count; i++ ) {
        jellyfish[ i ].pos[ 0 ] = jellyfishTargets[ i ].pos[ 0 ];
        jellyfish[ i ].pos[ 1 ] = jellyfishTargets[ i ].pos[ 1 ];
        jellyfish[ i ].pos[ 2 ] = jellyfishTargets[ i ].pos[ 2 ];
        if ( jellyfishTargets[ i ].scl < jellyfish[ i ].scl ) {
            jellyfish[ i ].scl = jellyfishTargets[ i ].scl;
        }
        jellyfish[ i ].scl = jellyfishTargets[ i ].scl;
        jellyfish[ i ].time = jellyfishTargets[ i ].time;

        jellyfish.order[ i ][ 0 ] = i;
        jellyfish.order[ i ][ 1 ] = jellyfish[ i ].pos;
    }
}

function drawJellyfish() {
    interpolateTargets();
    setMatrixUniforms();
    bindTexture( 'jellyfish' , 0 );
    bindTexture( 'luminescence' , 2 );
    bindTexture( 'caustics' + localParam.cycle32 , 1 );
    jellyfish.order.sort( sort3D );
    for ( var i = 0; i < jellyfish.count; i++ ) {
        var k = jellyfish.order[ i ][ 0 ];
        if ( jellyfish[ k ] ) {
            jellyfish[ k ].simulate();
            jellyfish[ k ].setLOD();
            jellyfish[ k ].draw();
        }
    }
}

function sort3D( a , b ) {
    var eye = V3.$( -localParam.camera.eye[ 0 ] , -localParam.camera.eye[ 1 ] + 20 , -localParam.camera.eye[ 2 ] );
    return (V3.length( V3.sub( eye , a[ 1 ] ) ) > V3.length( V3.sub( eye , b[ 1 ] ) ) ? -1 : ((V3.length( V3.sub( eye , a[ 1 ] ) ) < V3.length( V3.sub( eye , b[ 1 ] ) )) ? 1 : 0));
}

// 创建水母实例
function JellyfishInstance( pos , scl , time ) {
    this.pos = pos;
    this.scl = scl;
    this.time = time;
    this.lod = 0;
    this.propel = 1;

    this.s = {};

    // todo:初步把这里的spring当成弹力理解
    for ( var j = 0; j <= 3; j++ ) {
        this.s[ j ] = new Spring3D( pos[ 0 ] , pos[ 1 ] - 1 - j * this.scl , pos[ 2 ] );
    }

    this.draw = function () {
        setShader( "jellyfish" );
        this.propel = (Math.sin( this.time + Math.PI ) + 0.6) * 0.2;
        setjTimeUniform( this.time );
        setJointUniforms();
        drawBuffer( 'jellyfish' + this.lod );
    };

    this.setLOD = function () {
        V3.sub( this.pos , V3.neg( localParam.camera.eye ) , eyeDist );
        this.lod = 1;//Math.max(3-Math.floor(4/this.scl/2),0);
    };

    this.simulate = function () {
        this.s[ 0 ].spring = 1.295 * this.scl * (2 - this.propel);
        this.s[ 0 ].update( this.pos );
        this.s[ 0 ].gravity = -0.01;
        M4x4.makeTranslate( this.s[ 0 ].pos , joint0 );
        M4x4.mul( joint0 , this.s[ 0 ].lookat , joint0 );
        M4x4.scale1( this.scl , joint0 , joint0 );

        function setJoint( joint , obj , index ) {
            obj.s[ index ].spring = 2.95 * obj.scl;
            obj.s[ index ].update( obj.s[ index - 1 ].pos );
            obj.s[ index ].gravity = -0.02;
            M4x4.makeTranslate( obj.s[ index ].pos , joint );
            M4x4.mul( joint , obj.s[ index ].lookat , joint );
            M4x4.scale1( obj.scl , joint , joint );
            M4x4.translate3( 0 , 3 * index , 0 , joint , joint );
        }

        var joints = [ joint0 , joint1 , joint2 , joint3 ];
        for ( var j = 1; j < 4; j++ ) {
            setJoint( joints[ j ] , this , j );
        }

    }
}

function Spring3D( xpos , ypos , zpos ) {
    this.veloc = new V3.$( 0 , 0 , 0 );
    this.pos = new V3.$( xpos , ypos , zpos );
    this.gravity = -0.005;
    this.spring = 2;
    this.mass = 0.1;
    this.stiffness = 0.2;
    this.damping = 0.1;
    this.lookat = new M4x4.$();

    this.update = function ( target ) {
        V3.sub( target , this.pos , delta );// 取得距离

        V3.normalize( delta , deltaNorm );// 得到单位向量
        V3.scale( deltaNorm , this.spring , deltaNorm );// 将单位向量缩放spring倍
        V3.sub( delta , deltaNorm , delta );// 得到处理前与处理后之间的差

        V3.scale( delta , this.stiffness , force );// 得到力
        force[ 1 ] += this.gravity;
        V3.scale( force , 1 / this.mass , accel );// 得到加速度
        V3.add( force , accel , this.veloc );// 得到速度
        V3.scale( this.veloc , this.damping , this.veloc );
        V3.add( this.pos , this.veloc , this.pos );

        M4x4.makeLookAt( this.pos , target , localParam.camera.eye , this.lookat );
    };

}