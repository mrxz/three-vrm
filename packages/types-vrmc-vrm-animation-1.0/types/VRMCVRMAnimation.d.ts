import type { Expressions } from './Expressions.js';
import type { Humanoid } from './Humanoid.js';
import type { LookAt } from './LookAt.js';

/**
 * glTF extension that defines humanoid animations.
 */
export interface VRMCVRMAnimation {
  /**
   * Specification version of VRMC_vrm_animation
   */
  specVersion: '1.0' | '1.0-draft';

  /**
   * An object which describes about humanoid bones.
   */
  humanoid?: Humanoid;

  /**
   * An object which maps expressions to nodes.
   */
  expressions?: Expressions;

  /**
   * An object which maps a eye gaze point to a node.
   */
  lookAt?: LookAt;

  extensions?: { [name: string]: any };
  extras?: any;
}
