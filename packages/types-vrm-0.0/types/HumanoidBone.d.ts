import type { HumanoidBoneName } from './HumanoidBoneName.js';
import type { Vector3 } from './Vector3.js';

export interface HumanoidBone {
  /**
   * Human bone name.
   */
  bone?: HumanoidBoneName;

  /**
   * Reference node index
   */
  node?: number;

  /**
   * Unity's HumanLimit.useDefaultValues
   */
  useDefaultValues?: boolean;

  /**
   * Unity's HumanLimit.min
   */
  min?: Vector3;

  /**
   * Unity's HumanLimit.max
   */
  max?: Vector3;

  /**
   * Unity's HumanLimit.center
   */
  center?: Vector3;

  /**
   * Unity's HumanLimit.axisLength
   */
  axisLength?: number;
}
