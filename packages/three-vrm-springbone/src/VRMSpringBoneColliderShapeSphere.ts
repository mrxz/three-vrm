import * as THREE from 'three';
import { VRMSpringBoneColliderShape } from './VRMSpringBoneColliderShape.js';

export class VRMSpringBoneColliderShapeSphere extends VRMSpringBoneColliderShape {
  public get type(): 'sphere' {
    return 'sphere';
  }

  /**
   * The offset of the sphere from the origin in local space.
   */
  public offset: THREE.Vector3;

  /**
   * The radius.
   */
  public radius: number;

  /**
   * If true, the collider prevents spring bones from going outside of the sphere instead.
   */
  public inside: boolean;

  public constructor(params?: { radius?: number; offset?: THREE.Vector3; inside?: boolean }) {
    super();

    this.offset = params?.offset ?? new THREE.Vector3(0.0, 0.0, 0.0);
    this.radius = params?.radius ?? 0.0;
    this.inside = params?.inside ?? false;
  }

  public calculateCollision(
    colliderMatrix: THREE.Matrix4,
    objectPosition: THREE.Vector3,
    objectRadius: number,
    target: THREE.Vector3,
  ): number {
    target.x = objectPosition.x - colliderMatrix.elements[12];
    target.y = objectPosition.y - colliderMatrix.elements[13];
    target.z = objectPosition.z - colliderMatrix.elements[14];

    const length = target.length();
    const distance = length - objectRadius - this.radius;

    if (distance < 0) {
      target.multiplyScalar(1 / length); // convert the delta to the direction
    }

    /*
    const length = target.length();
    const distance = this.inside
      ? this.radius - objectRadius - length
      : length - objectRadius - this.radius;

    target.multiplyScalar(1 / length); // convert the delta to the direction
    if (this.inside) {
      target.negate(); // if inside, reverse the direction
    }*/

    return distance;
  }
}
