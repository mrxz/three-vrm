import { HumanoidHumanBones } from './HumanoidHumanBones.js';

/**
 * An object which describes about humanoid bones.
 */
export interface Humanoid {
  /**
   * An object which maps humanoid bones to nodes.
   */
  humanBones: HumanoidHumanBones;
}
