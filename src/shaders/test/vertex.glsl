uniform float uScrollY;
varying vec2 vUv;

void main()
{
  vUv = uv;

  vec4 modelPosition = modelMatrix * vec4(position, 1.0);
  float offset = (modelPosition.x - uScrollY) * 0.5;
  modelPosition.z += sin(modelPosition.x * 1.0) * 10. * uScrollY;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}