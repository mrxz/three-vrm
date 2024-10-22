import type { HumanoidHumanBone } from './HumanoidHumanBone.js';
import type { HumanoidHumanBoneName } from '@pixiv/types-vrmc-vrm-1.0';

/**
 * An object which maps humanoid bones to nodes.
 */
export type HumanoidHumanBones = {
  [key in HumanoidHumanBoneName]?: HumanoidHumanBone;
};
