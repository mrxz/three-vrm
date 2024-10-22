import type { HumanoidHumanBone } from './HumanoidHumanBone.js';
import type { HumanoidHumanBoneName } from './HumanoidHumanBoneName.js';

/**
 * Represents a set of humanBones of a humanoid.
 */
export type HumanoidHumanBones = {
  [key in HumanoidHumanBoneName]?: HumanoidHumanBone;
};
