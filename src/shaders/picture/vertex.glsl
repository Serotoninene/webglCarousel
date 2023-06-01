uniform float uScrollY;
uniform float uProgress;
uniform float uValue;
uniform vec2 uResolution; 
uniform vec2 uQuadSize;


varying vec2 vUv;
varying vec2 vSize;

float PI = 3.141592653589793238;

// make a circleShape function that takes a radius and returns a float
float circleShape(float radius, vec2 position) {
  float value = distance(position, vec2(0.5));
  return step(radius,value);
}

void main()
{
  vUv = uv;
  vec3 newPosition = position;
  float sine = sin(PI * uProgress);
  float distortion = 0.1;
  float numberofWaves = 5.0;
  float waveLength = 2.;

  float waves = sine * distortion * sin(numberofWaves * length(uv) + waveLength * uProgress);
  vSize = mix(uQuadSize, uResolution, uProgress);

// =============================================== HOVER EFFECT ===============================================
 // Calculate the distance from the vertex to the center
  vec2 center = vec2(0.0, 0.0);
  float distance = length(position.xy - center);

  // Determine the radius for the rounded corners
  float cornerRadius = 0.5; // Radius in pixels
  float smoothness = 0.1; // Controls the smoothness of the rounded corners
  float startTransition = cornerRadius - smoothness;
  float endTransition = cornerRadius + smoothness;
  float rounded = smoothstep(startTransition, endTransition, distance);


  // =================== ROUNDED SHAPE ===================
  newPosition.xy = mix(position.xy, normalize(position.xy + vec2(0.00001)) * cornerRadius, rounded);
  newPosition.xy = mix(newPosition.xy, position.xy, step(0.0, position.x) * step(position.y, 0.0));

  // do the transition, using uValue between the position and the newPOsition
  vec4 mixedPosition = mix(vec4(position, 1.0), vec4(newPosition, 1.0), uValue);
// =============================================== END OF HOVER EFFECT ===============================================

// =============================================== FULLSCREEN EFFECT ===============================================
  vec4 modelPosition = modelMatrix * mixedPosition;
  vec4 fullScreenState = vec4(position, 1.0);

  fullScreenState.x *=  uResolution.x;
  fullScreenState.y *=  uResolution.y;

  modelPosition.z += sin(modelPosition.x * 1.0) * 5. * uScrollY;
// =============================================== HALF OF SCREEN EFFECT ===============================================

  vec4 mixedState = mix(modelPosition, fullScreenState, uProgress + waves);


  vec4 viewPosition = viewMatrix * mixedState;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}