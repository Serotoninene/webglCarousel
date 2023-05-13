uniform float uScrollY;
uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution; 
uniform vec2 uQuadSize;
uniform vec4 uCorners;

varying vec2 vUv;
varying vec2 vSize;

float PI = 3.141592653589793238;

void main()
{
  vUv = uv;
  float sine = sin(PI * uProgress);
  float waves = sine * 0.1 * sin(5. * length(uv) + 5. * uProgress);
  vSize = mix(uQuadSize, uResolution, uProgress);

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  vec4 fullScreenState = vec4(position, 1.0);
  // fullScreenState.x -= .5;
  fullScreenState.x *=  uResolution.x / uQuadSize.x;
  fullScreenState.y *=  uResolution.y / uQuadSize.y;
  modelPosition.z += sin(modelPosition.x * 1.0) * 5. * uScrollY;
  float cornerProgress = mix (mix(uCorners.x, uCorners.y, vUv.x),mix(uCorners.z, uCorners.w, vUv.x), vUv.y);
  vec4 mixedState = mix(modelPosition, fullScreenState, uProgress + waves);


  vec4 viewPosition = viewMatrix * mixedState;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}