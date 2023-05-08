precision highp float;
uniform sampler2D uTexture;
uniform float uProgress;

varying vec2 vUv;


void main()
{
  vec4 color = texture2D(uTexture, vUv);
  // gl_FragColor = vec4(uProgress ,0.0 ,0.0 , 1.0);
  gl_FragColor = vec4(color);
}