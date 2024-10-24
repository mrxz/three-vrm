import type { SpringBoneColliderShape } from './SpringBoneColliderShape.js';

/**
 * collider definition for SpringBone
 */
export interface SpringBoneCollider {
  node?: number;

  shape?: SpringBoneColliderShape;

  extensions?: { [name: string]: any };
  extras?: any;
}
