import type { HumanoidHumanBones } from './HumanoidHumanBones.js';

/**
 * Correspondence between nodes and human bones
 */
export interface Humanoid {
  humanBones: HumanoidHumanBones;

  extensions?: { [name: string]: any };
  extras?: any;
}
