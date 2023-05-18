uniform float uScrollY;
uniform float uTime;
uniform float uProgress;
uniform float uValue;
uniform vec2 uResolution; 
uniform vec2 uQuadSize;
uniform vec4 uCorners;


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
  float waves = sine * 0.1 * sin(5. * length(uv) + 5. * uProgress);
  vSize = mix(uQuadSize, uResolution, uProgress);

// =============================================== HOVER EFFECT ===============================================
 // Calculate the distance from the vertex to the center
  vec2 center = vec2(0.0, 0.0);
  float distance = length(position.xy - center);

  // Determine the radius for the rounded corners
  float cornerRadius = 0.5 * 2.4; // Radius in pixels
  float circle = circleShape(distance, position.xy);

  // =================== ROUNDED SHAPE ===================
  newPosition.xy = mix(position.xy, normalize(position.xy + vec2(0.00001)) * cornerRadius, smoothstep(cornerRadius, cornerRadius, distance));
  newPosition.xy = mix(newPosition.xy, position.xy, step(0.0, position.x) * step(position.y, 0.0));

  // do the transition, using uValue between the position and the newPOsition
  vec4 mixedPosition = mix(vec4(position, 1.0), vec4(newPosition, 1.0), uValue);
// =============================================== END OF HOVER EFFECT ===============================================

// =============================================== FULLSCREEN EFFECT ===============================================
  vec4 modelPosition = modelMatrix * mixedPosition;
  vec4 fullScreenState = vec4(position, 1.0);

  fullScreenState.x *=  uResolution.x  / uQuadSize.x ;
  fullScreenState.y *=  uResolution.y / uQuadSize.y;

  modelPosition.z += sin(modelPosition.x * 1.0) * 5. * uScrollY;
// =============================================== HALF OF SCREEN EFFECT ===============================================

  vec4 mixedState = mix(modelPosition, fullScreenState, uProgress + waves  );


  vec4 viewPosition = viewMatrix * mixedState;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}