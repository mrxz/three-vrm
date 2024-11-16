import * as THREE from 'three';
import { VRMSpringBoneColliderShape } from './VRMSpringBoneColliderShape.js';
import { VRMSpringBoneColliderShapeSphere } from './VRMSpringBoneColliderShapeSphere.js';
import { VRMSpringBoneColliderShapeCapsule } from './VRMSpringBoneColliderShapeCapsule.js';

/**
 * Represents a collider of a VRM.
 */
export class VRMSpringBoneCollider extends THREE.Object3D {
  /**
   * The shape of the collider.
   */
  public readonly shape: VRMSpringBoneColliderShape;

  public constructor(shape: VRMSpringBoneColliderShape) {
    super();

    this.shape = shape;
    if (this.shape instanceof VRMSpringBoneColliderShapeSphere) {
      this.position.copy(this.shape.offset);
    } else if (this.shape instanceof VRMSpringBoneColliderShapeCapsule) {
      this.position.copy(this.shape.offset);
    } else {
      throw new Error('Unsupported shape');
    }

    this.updateMatrix();
    this.matrixAutoUpdate = false;
    //this.matrixWorldAutoUpdate = false;
  }
}
