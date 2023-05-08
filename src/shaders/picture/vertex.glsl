uniform float uScrollY;
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution; 
uniform vec2 uQuadSize;

varying vec2 vUv;

void main()
{
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 fullScreenState = vec4(position, 1.0);
  fullScreenState.x *=  uResolution.x / uQuadSize.x;
  fullScreenState.y *=  uResolution.y / uQuadSize.y  ;
  vec4 mixedState = mix(modelPosition, fullScreenState, uProgress);
  // modelPosition.z += sin(modelPosition.x * 1.0) * 5. * uScrollY * mixedState.x;

  vec4 viewPosition = viewMatrix * mixedState;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}