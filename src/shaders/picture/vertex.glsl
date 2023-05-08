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
  vec4 fullScreenState = vec4(position, 1.0) ;
  // I want it to take the whole screen but it's getting way too much enlarged 
  // how can i set the uResolution values into NDC space?
  fullScreenState.x *= uResolution.x / uQuadSize.x;
  fullScreenState.y *= uResolution.y / uQuadSize.y;
  vec4 mixedState = mix(modelPosition, fullScreenState, uProgress);
  modelPosition.z += sin(modelPosition.x * 0.2) * 2. * uScrollY * mixedState.x;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}