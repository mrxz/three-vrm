import type { SecondaryAnimationCollider } from './SecondaryAnimationCollider.js';

export interface SecondaryAnimationColliderGroup {
  /**
   * The node of the collider group for setting up collision detections.
   */
  node?: number;

  colliders?: SecondaryAnimationCollider[];
}
