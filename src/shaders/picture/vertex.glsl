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

 // Calculate the distance from the vertex to the center
  vec2 center = vec2(0.0, 0.0);
  float distance = length(position.xy - center);

  // Determine the radius for the rounded corners
  float cornerRadius = 0.5 * 2.4; // Radius in pixels
  float circle = circleShape(distance, position.xy);

  // newPosition = vec3(circle);

  // Determine the masking factor for the corners
  // float t = smoothstep(0., 1., newPosition.y);
  // newPosition.xy = mix(newPosition.xy, vec2(0.0), t);

  // =================== ROUNDED SHAPE ===================
  newPosition.xy = mix(position.xy, normalize(position.xy + vec2(0.00001)) * cornerRadius, smoothstep(cornerRadius, cornerRadius, distance));
  // make the bottom-right corner not round (because we want to put the logo there)
  newPosition.xy = mix(newPosition.xy, position.xy, step(0.0, position.x) * step(position.y, 0.0));

  // =================== HOUSE SHAPE ===================
  // float topEdgeDistance = max(0.0 ,abs(position.y)) - (uQuadSize.x / 2.0 - abs(position.x));

  // float mixValue = smoothstep(0.0, 1.0, topEdgeDistance);
  // if (position.y > 0.0 && abs(position.y) > uQuadSize.x/2. - abs(position.x)) {

  // newPosition.xy = mix(position.xy, vec2(0.0, 0.0), mixValue);
  // }

  // vec4 mixedPosition = mix(vec4(newPosition, 1.0), vec4(0.0, 0.0, 0.0, 1.0), uValue);


  // do the transition, using uValue between the position and the newPOsition
  vec4 mixedPosition = mix(vec4(position, 1.0), vec4(newPosition, 1.0), uValue);




  

  vec4 modelPosition = modelMatrix * mixedPosition;
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