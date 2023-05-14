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
  vec3 newPosition = position;
  float sine = sin(PI * uProgress);
  float waves = sine * 0.1 * sin(5. * length(uv) + 5. * uProgress);
  vSize = mix(uQuadSize, uResolution, uProgress);

//  // Calculate the distance from the vertex to the center
//   vec2 center = vec2(0.0, 0.0);
//   float distance = length(position.xy - center);

//   // Determine the radius for the rounded corners
//   float cornerRadius = 0.5 * 2.4; // Adjust as needed

  //  // Round all the corners except the top left corner
  // if (position.x > 0.0) {
  //   if (position.y > 0.0) {
  //     // Top right corner
  //     newPosition.x = max(position.x, cornerRadius);
  //     newPosition.y = max(position.y, cornerRadius);
  //   } else {
  //     // Bottom right corner
  //     newPosition.x = max(position.x, cornerRadius);
  //     newPosition.y = min(position.y, -cornerRadius);
  //   }
  // }

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