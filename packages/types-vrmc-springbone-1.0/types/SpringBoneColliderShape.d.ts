import type { SpringBoneColliderSphere } from './SpringBoneColliderSphere.js';
import type { SpringBoneColliderCapsule } from './SpringBoneColliderCapsule.js';

/**
 * Shape of collider. Have one of sphere and capsule
 */
export interface SpringBoneColliderShape {
  sphere?: SpringBoneColliderSphere;
  capsule?: SpringBoneColliderCapsule;

  extensions?: { [name: string]: any };
  extras?: any;
}
