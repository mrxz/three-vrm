import type { SecondaryAnimationColliderGroup } from './SecondaryAnimationColliderGroup.js';
import type { SecondaryAnimationSpring } from './SecondaryAnimationSpring.js';

/**
 * The setting of automatic animation of string-like objects such as tails and hairs.
 */
export interface SecondaryAnimation {
  boneGroups?: SecondaryAnimationSpring[];
  colliderGroups?: SecondaryAnimationColliderGroup[];
}
