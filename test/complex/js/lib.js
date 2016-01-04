/**
 * Created by WQ on 2016/1/4.
 */

// 并发
function concurrentTask( tasks , callback ) {
    var len = tasks.length , count = 0;
    tasks.forEach( function ( task ) {
        task( function () {
            ++count == len && callback();
        } );
    } );
}

function bindEvent( el , type , func ) {
    el.addEventListener( type , func );
    return {
        remove : function () {
            el.removeEventListener( type , func );
        }
    }
}

function onDrag( el , args ) {
    var prex , prey;
    bindEvent( el , "mousedown" , function ( e ) {
        prex = e.pageX;
        prey = e.pageY;
        var moveH = bindEvent( document , "mousemove" , function ( e ) {
            var dx = e.pageX - prex;
            var dy = e.pageY - prey;
            args.onMove && args.onMove( dx , dy );
            prex = e.pageX;
            prey = e.pageY;
        } );
        var endH = bindEvent( document , "mouseup" , function () {
            moveH.remove();
            endH.remove();
        } );
    } );
}

function rotate3dM( x , y , z , a ) {
    a = a * Math.PI / 180;
    var cosa = Math.cos( a ) , sina = Math.sin( a );
    var r = Math.sqrt( x * x + y * y + z * z );
    x /= r;
    y /= r;
    z /= r;
    return [
        1 + (1 - cosa) * ( x * x - 1 ) , z * sina + x * y * (1 - cosa) , -y * sina + x * z * (1 - cosa) , 0 ,
        -z * sina + x * y * (1 - cosa) , 1 + (1 - cosa) * (y * y - 1) , x * sina + y * z * (1 - cosa) , 0 ,
        y * sina + x * z * (1 - cosa) , -x * sina + y * z * (1 - cosa) , 1 + (1 - cosa) * (z * z - 1) , 0 ,
        0 , 0 , 0 , 1
    ]
}

function mul( m1 , m2 ) {
    var re = [];
    for ( var r = 0; r < 4; r++ ) {
        for ( var c = 0; c < 4; c++ ) {
            re[ r * 4 + c ] = 0;
            for ( var k = 0; k < 4; k++ ) {
                re[ r * 4 + c ] += m1[ r * 4 + k ] * m2[ k * 4 + c ];
            }
        }
    }
    return re;
}

function combine() {
    var result = [
        1 , 0 , 0 , 0 ,
        0 , 1 , 0 , 0 ,
        0 , 0 , 1 , 0 ,
        0 , 0 , 0 , 1
    ];
    for ( var i = 0; i < arguments.length; i++ ) {
        result = mul( result , arguments[ i ] );
    }
    return result;
}