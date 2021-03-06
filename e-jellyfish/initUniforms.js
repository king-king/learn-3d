/**
 * Created by WQ on 2015/12/31.
 */
var mWorld = new M4x4.$();
var mViewInv = new M4x4.$();
var mProjection = new M4x4.$();
var mWorldView = new M4x4.$();
var mWorldViewProj = new M4x4.$();
var mTemp = new M4x4.$();

var joint0 = new M4x4.$();
var joint1 = new M4x4.$();
var joint2 = new M4x4.$();
var joint3 = new M4x4.$();
var joint0InvTranspose = new M4x4.$();

function setTimeUniform( time ) {
    gl.uniform1f( currentProgram.currentTime , time );
}
function setjTimeUniform( time ) {
    gl.uniform1f( currentProgram.currentJellyfishTime , time );
}

function setJointUniforms() {
    gl.uniformMatrix4fv( currentProgram.joint0 , false , new Float32Array( joint0 ) );
    gl.uniformMatrix4fv( currentProgram.joint1 , false , new Float32Array( joint1 ) );
    gl.uniformMatrix4fv( currentProgram.joint2 , false , new Float32Array( joint2 ) );
    gl.uniformMatrix4fv( currentProgram.joint3 , false , new Float32Array( joint3 ) );

    M4x4.inverseOrthonormal( joint0 , joint0InvTranspose );
    M4x4.transpose( joint0InvTranspose , joint0InvTranspose );
    gl.uniformMatrix4fv( currentProgram.joint0InvTranspose , false , new Float32Array( joint0InvTranspose ) );
}

function setMatrixUniforms() {
    // Set necessary matrices
    M4x4.mul( mView , mWorld , mWorldView );
    M4x4.mul( mProjection , mWorldView , mWorldViewProj );
    M4x4.inverseOrthonormal( mView , mViewInv );

    // Set Uniforms
    gl.uniformMatrix4fv( currentProgram.world , false , new Float32Array( mWorld ) );
    gl.uniformMatrix4fv( currentProgram.worldView , false , new Float32Array( mWorldView ) );
    gl.uniformMatrix4fv( currentProgram.worldViewProj , false , new Float32Array( mWorldViewProj ) );
    gl.uniformMatrix4fv( currentProgram.viewInv , false , new Float32Array( mViewInv ) );
}