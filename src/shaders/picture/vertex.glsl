uniform float uScrollY;
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution; 
uniform vec2 uQuadSize;

varying vec2 vUv;
varying vec2 vSize;

void main()
{
  vUv = uv;
  vSize = mix(uQuadSize, uResolution, uProgress);

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 fullScreenState = vec4(position, 1.0);
  fullScreenState.x *=  uResolution.x / uQuadSize.x;
  fullScreenState.y *=  uResolution.y / uQuadSize.y  ;
  modelPosition.z += sin(modelPosition.x * 1.0) * 5. * uScrollY;
  vec4 mixedState = mix(modelPosition, fullScreenState, uProgress);


  vec4 viewPosition = viewMatrix * mixedState;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}