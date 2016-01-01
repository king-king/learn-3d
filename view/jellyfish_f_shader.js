/**
 * Created by wangqun on 16/1/1.
 */

var f_shader=
    "precision mediump float;\n"+

    "uniform sampler2D uSampler0;\n"+// 水母贴图
    "uniform sampler2D uSampler1;\n"+// 光线波纹贴图
    "uniform sampler2D uSampler2;\n"+// 冷光贴图

    "uniform float uCurrentTime;\n"+

    "varying vec4 vWorld;\n"+

    "varying vec3 vTextureCoord;\n"+
    "varying vec3 vDiffuse;\n"+
    "varying vec3 vFresnel;\n"+

    "void main(void) {\n"+
    "    vec3 caustics = texture2D(uSampler1, vec2((vWorld.x)/48.+uCurrentTime/12., (vWorld.z-vWorld.y)/95.)).rgb;\n"+
    "    vec4 colorMap = texture2D(uSampler0, vec2(vTextureCoord.s, vTextureCoord.t));\n"+

    "    gl_FragColor = vec4(((vDiffuse + caustics)*colorMap.rgb) + vFresnel, colorMap.a);\n"+
    "}\n";
