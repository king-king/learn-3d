/**
 * Created by WQ on 2015/12/31.
 */
var v_shader =
    "precision mediump float;\n" +
    "attribute vec3 aVertexPosition;\n" +
    "attribute vec3 aVertexNormal;\n" +
    "attribute vec3 aVertexColor;\n" +
    "attribute vec3 aTextureCoord;\n" +
    "attribute vec4 aSkinWeight;\n" +
    "uniform mat4 uWorld;\n" +
    "uniform mat4 uViewInv;\n" +
    "uniform mat4 uWorldView;\n" +
    "uniform mat4 uWorldViewProj;\n" +
    "uniform float uCurrentTime;\n" +

    "uniform mat4 uJoint0;\n" +
    "uniform mat4 uJoint1;\n" +
    "uniform mat4 uJoint2;\n" +
    "uniform mat4 uJoint3;\n" +
    "uniform mat4 uJoint0InvTranspose;\n" +

    "uniform float uCurrentJellyfishTime;\n" +

    "varying vec4 vWorld;\n" +
    "varying vec3 vTextureCoord;\n" +
    "varying vec3 vDiffuse;\n" +
    "varying vec3 vFresnel;\n" +

    "void main(void) {\n" +
        //Vertex Animation
    "    float dpi = 6.2831853;\n" +
    "    float pi = 3.14159265;\n" +
    "    float hpi = 1.570796325;\n" +
    "    float time = mod(uCurrentJellyfishTime+aVertexPosition.y, dpi);\n" +
    "    float offset = smoothstep(0.0,1.,max(0.,-aVertexPosition.y-0.8)/10.);\n" +
    "   vec3 anim = (vec3(aVertexColor.x,aVertexColor.y,aVertexColor.z)/8.0*sin(time) * (1.-offset));\n" +
    "    vec3 pos = aVertexPosition + anim\n" +
        //skinning
    "    pos = vec3(uJoint0 * vec4(pos, 1.0))*aSkinWeight.x +\n" +
    "        vec3(uJoint1 * vec4(pos, 1.0))*aSkinWeight.y +\n" +
    "        vec3(uJoint2 * vec4(pos, 1.0))*aSkinWeight.z +\n" +
    "        vec3(uJoint3 * vec4(pos, 1.0))*aSkinWeight.w;\n" +
    "    vec3 nrm = vec3(uJoint0InvTranspose * vec4(aVertexNormal, 1.0));\n" +
        //matrices
    "    vWorld =               uWorld * vec4(pos, 1.0);\n" +
    "    vec4 WorldViewProj =       uWorldViewProj * vec4(pos, 1.0);\n" +
        //vertex normal
    "    vec3 VertexNormal = normalize(nrm);\n" +
        //vertex eye vector
    "    vec3 WorldEyeVec = normalize(vWorld.xyz - uViewInv[3].xyz);\n" +
        //diffuse
    "    vec3 lightDir = vec3(0.0,1.0,0.0);\n" +
    "    vec3 lightCol = vec3(0.6,0.4,0.1);\n" +
    "    vec3 ambientCol = vec3(0.5,0.2,0.1);\n" +
    "    float diffuseProduct = max(dot(normalize(VertexNormal.xyz), lightDir), 0.0);\n" +
    "    vDiffuse = lightCol * vec3(diffuseProduct) + ambientCol;\n" +
        //fresnel
    "   vec3 fresnelColor = vec3(0.2,0.5,0.6);\n" +
    "   float fresnelProduct = pow(1.0-max(abs(dot(VertexNormal, -WorldEyeVec)), 0.0), 2.0);\n" +
    "   vFresnel = fresnelColor * vec3(fresnelProduct);\n" +
        //texture coords
    "   vTextureCoord = aTextureCoord;\n" +

    "   gl_Position = WorldViewProj;\n" +
    "}\n";

