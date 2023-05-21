uniform vec2 uResolution;

varying vec2 vUv;


void main() {
  vUv = uv;

  vec4 modelPosition =  vec4(position, 1.0);
  modelPosition.x *= uResolution.x ;
  modelPosition.y *= uResolution.y;
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;
  
  gl_Position = projectedPosition;  
}
