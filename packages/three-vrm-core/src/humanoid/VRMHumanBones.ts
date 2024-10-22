import type { VRMHumanBone } from './VRMHumanBone.js';
import type { VRMHumanBoneName } from './VRMHumanBoneName.js';
import type { VRMRequiredHumanBoneName } from './VRMRequiredHumanBoneName.js';

/**
 * A map from {@link VRMHumanBoneName} to {@link VRMHumanBone}.
 */
export type VRMHumanBones = { [name in VRMHumanBoneName]?: VRMHumanBone } & {
  [name in VRMRequiredHumanBoneName]: VRMHumanBone;
};
